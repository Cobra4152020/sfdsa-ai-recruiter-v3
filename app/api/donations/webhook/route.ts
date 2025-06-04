export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { headers } from "next/headers";
import { awardDonationPoints } from "@/lib/donation-points-service-server";
import { createNotification } from "@/lib/notification-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  const supabase = getServiceSupabase();

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}`);

      // Update donation status in database
      await supabase
        .from("donations")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("payment_id", paymentIntent.id);

      // Get the donation details
      const { data: donationData } = await supabase
        .from("donations")
        .select("*")
        .eq("payment_id", paymentIntent.id)
        .single();

      if (donationData && donationData.donor_id) {
        // Award points for the donation
        await awardDonationPoints(
          donationData.donor_id,
          paymentIntent.id,
          donationData.amount,
          false, // one-time donation
        );

        // Create a real-time notification for the donation
        await createNotification({
          user_id: donationData.donor_id,
          type: "donation",
          title: "Thank you for your donation!",
          message: `Your donation of $${donationData.amount.toFixed(2)} has been received. Thank you for supporting the SF Sheriff's Office!`,
          action_url: "/donate/thank-you",
          metadata: {
            amount: donationData.amount,
            paymentId: paymentIntent.id,
            recurring: false,
          },
        });
      }

      // Record analytics
      await supabase.from("donation_analytics").insert({
        payment_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        payment_method_type:
          paymentIntent.payment_method_types?.[0] || "unknown",
        event_type: "payment_succeeded",
        timestamp: new Date().toISOString(),
      });
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${failedPaymentIntent.id}`);

      // Update donation status in database
      await supabase
        .from("donations")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("payment_id", failedPaymentIntent.id);
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice paid: ${invoice.id}`);

      if (invoice.subscription) {
        // Update subscription status in database
        await supabase
          .from("subscriptions")
          .update({ status: "active", updated_at: new Date().toISOString() })
          .eq("subscription_id", invoice.subscription);

        // Create a donation record for this payment
        if (invoice.customer_email) {
          const { data: insertedDonation } = await supabase
            .from("donations")
            .insert({
              amount: invoice.amount_paid / 100,
              donor_email: invoice.customer_email,
              donor_name: invoice.customer_name || null,
              payment_processor: "stripe",
              payment_id: invoice.id,
              subscription_id: invoice.subscription,
              status: "completed",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          // Get customer ID
          const { data: subscriptionData } = await supabase
            .from("subscriptions")
            .select("donor_id")
            .eq("subscription_id", invoice.subscription)
            .single();

          if (
            subscriptionData &&
            subscriptionData.donor_id &&
            insertedDonation
          ) {
            // Award points for the recurring donation
            await awardDonationPoints(
              subscriptionData.donor_id,
              invoice.id,
              invoice.amount_paid / 100,
              true, // recurring donation
            );

            // Create a real-time notification for the recurring donation
            await createNotification({
              user_id: subscriptionData.donor_id,
              type: "donation",
              title: "Thank you for your recurring donation!",
              message: `Your monthly donation of $${(invoice.amount_paid / 100).toFixed(2)} has been processed. Thank you for your continued support!`,
              action_url: "/donate/thank-you",
              metadata: {
                amount: invoice.amount_paid / 100,
                paymentId: invoice.id,
                recurring: true,
              },
            });
          }
        }
      }
      break;

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice payment failed: ${failedInvoice.id}`);

      if (failedInvoice.subscription) {
        // Update subscription status in database
        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("subscription_id", failedInvoice.subscription);
      }
      break;

    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription cancelled: ${subscription.id}`);

      // Update subscription status in database
      await supabase
        .from("subscriptions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("subscription_id", subscription.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
