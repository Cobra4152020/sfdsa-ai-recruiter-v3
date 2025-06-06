export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/app/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const {
      amount,
      donorEmail,
      donorName,
      isRecurring,
      interval = "month",
      donationMessage,
      allowRecognition,
    } = await request.json();

    console.log("Payment intent request:", { amount, donorEmail, isRecurring });

    // Validate the amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least $1" },
        { status: 400 },
      );
    }

    const supabase = getServiceSupabase();

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Add organization info to metadata
    const metadata = {
      name: donorName || "",
      message: donationMessage || "",
      organization: "protecting", // Always set to Protecting SF
    };

    if (isRecurring) {
      // Create or retrieve customer
      let customer;
      const { data: existingCustomers } = await supabase
        .from("stripe_customers")
        .select("customer_id")
        .eq("email", donorEmail)
        .limit(1);

      if (existingCustomers && existingCustomers.length > 0) {
        customer = { id: existingCustomers[0].customer_id };
      } else {
        customer = await stripe.customers.create({
          email: donorEmail,
          name: donorName,
          metadata,
        });

        // Store customer in database
        await supabase.from("stripe_customers").insert({
          email: donorEmail,
          customer_id: customer.id,
          created_at: new Date().toISOString(),
        });
      }

      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Monthly Donation to Protecting San Francisco",
                metadata,
              },
              unit_amount: amountInCents,
              recurring: {
                interval: interval as "month" | "year",
              },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata,
      });

      // Store subscription in database
      await supabase.from("subscriptions").insert({
        subscription_id: subscription.id,
        donor_id: customer.id,
        donor_email: donorEmail,
        amount: amount,
        interval: interval,
        status: "incomplete",
        organization: "protecting", // Always set to Protecting SF
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      // Add logging before returning the response
      console.log("Payment intent created successfully");

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      // Create a one-time payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        payment_method_types: ["card"],
        receipt_email: donorEmail,
        metadata,
      });

      // Store donation in database
      await supabase.from("donations").insert({
        amount: amount,
        donor_email: donorEmail,
        donor_name: donorName || null,
        payment_processor: "stripe",
        payment_id: paymentIntent.id,
        status: "pending",
        organization: "protecting", // Always set to Protecting SF
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        allow_recognition: allowRecognition || false,
      });

      // Add logging before returning the response
      console.log("Payment intent created successfully");

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Error creating payment: " + (error as Error).message },
      { status: 500 },
    );
  }
}
