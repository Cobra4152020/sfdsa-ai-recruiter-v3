// This is a simplified knowledge base for Sgt. Ken
// In a production environment, this would be replaced with a more sophisticated system

type KnowledgeEntry = {
  keywords: string[];
  response: string;
};

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["salary", "pay", "money", "compensation", "earn", "income"],
    response:
      "The San Francisco Sheriff's Department offers a competitive salary range of $116,428 to $184,362 for Deputy Sheriffs, depending on experience and qualifications. This is complemented by excellent benefits including healthcare, retirement plans, and various allowances. Deputies also have opportunities for overtime and special assignment pay.",
  },
  {
    keywords: ["requirements", "qualify", "eligible", "qualifications"],
    response:
      "To become a San Francisco Deputy Sheriff, you must be at least 21 years old, have a high school diploma or GED, be a U.S. citizen or permanent resident who has applied for citizenship, have a valid driver's license, and have no felony convictions. You must also pass a background check, medical examination, psychological evaluation, and physical abilities test.",
  },
  {
    keywords: ["application", "process", "apply", "steps", "how to apply"],
    response:
      "The application process for becoming a San Francisco Deputy Sheriff includes several steps: 1) Complete an online application, 2) Pass a written exam, 3) Complete a physical abilities test, 4) Pass an oral interview, 5) Successfully complete a background investigation, 6) Pass medical and psychological evaluations, and 7) Complete the Sheriff's Academy. The entire process typically takes 4-6 months.",
  },
  {
    keywords: ["academy", "training", "learn"],
    response:
      "The San Francisco Sheriff's Department Academy is approximately 23 weeks long. During this time, recruits receive comprehensive training in law enforcement techniques, legal procedures, defensive tactics, firearms, emergency response, and more. The academy is challenging but rewarding, designed to prepare you for the important responsibilities of a Deputy Sheriff.",
  },
  {
    keywords: ["benefits", "healthcare", "insurance", "retirement", "pension"],
    response:
      "San Francisco Deputy Sheriffs receive excellent benefits including comprehensive medical, dental, and vision coverage for themselves and their dependents. The retirement plan allows deputies to retire after 25 years of service with up to 75% of their highest salary. Additional benefits include paid vacation, sick leave, tuition reimbursement, and access to housing assistance programs.",
  },
  {
    keywords: ["schedule", "hours", "shifts", "work schedule", "days off"],
    response:
      "The San Francisco Sheriff's Department offers several shift options to accommodate various lifestyles: 1) Traditional 8-hour shifts, 5 days a week with weekends off for many administrative positions, 2) 12-hour shifts with 3 days on/4 days off, which provides longer stretches of time off, and 3) 12-hour shifts with 4 days on/3 days off. New deputies typically start with one of the 12-hour shift patterns, with more schedule options becoming available with seniority.",
  },
  {
    keywords: ["career", "advancement", "promotion", "growth", "future"],
    response:
      "The San Francisco Sheriff's Department offers numerous advancement opportunities. Deputies can promote to Senior Deputy, Sergeant, Lieutenant, Captain, and beyond. There are also specialized units such as K-9, Emergency Response Team, Hostage Negotiation Team, and various administrative and investigative positions. Promotions are based on experience, performance, testing, and interviews.",
  },
  {
    keywords: ["veteran", "military", "gi bill", "service"],
    response:
      "The San Francisco Sheriff's Department values military experience. Veterans may receive hiring preference points, and those with GI Bill benefits can use them during academy training. Your military training and discipline are highly valued in law enforcement. We have several programs to help veterans transition successfully to a career in the Sheriff's Department.",
  },
  {
    keywords: ["housing", "live", "residence", "commute", "relocation"],
    response:
      "While deputies are not required to live within San Francisco city limits, there are benefits to living locally. The department offers access to discounted housing programs and first-time homebuyer assistance specifically for law enforcement officers in San Francisco. These programs can make living in or near the city more affordable on a deputy's salary.",
  },
  {
    keywords: ["physical", "fitness", "test", "requirements", "exercise"],
    response:
      "The physical abilities test includes events such as a 1.5-mile run, push-ups, sit-ups, and an obstacle course designed to simulate job-related tasks. Specific requirements vary by age and gender. I recommend starting a fitness routine well before applying. The department sometimes offers pre-academy physical training programs to help candidates prepare.",
  },
  {
    keywords: ["background", "check", "investigation", "history", "disqualify"],
    response:
      "The background investigation is thorough and includes checking your employment history, education, financial records, criminal history, driving record, and personal references. Honesty throughout the application process is crucial. Common disqualifiers include felony convictions, recent drug use, significant financial problems, and dishonesty during the application process.",
  },
  {
    keywords: ["age", "too old", "maximum age", "minimum age"],
    response:
      "The minimum age to become a Deputy Sheriff is 21. There is no maximum age limit, and we have had successful candidates join the department in their 40s and 50s. As long as you can meet the physical requirements and complete the academy training, you are encouraged to apply regardless of your age.",
  },
  {
    keywords: ["education", "college", "degree", "school"],
    response:
      "While a high school diploma or GED is the minimum educational requirement, many deputies have associate's or bachelor's degrees. Higher education can be beneficial for career advancement. The department offers tuition reimbursement for continuing education, and college credits can sometimes be earned during academy training.",
  },
  {
    keywords: ["tattoos", "appearance", "grooming", "dress code"],
    response:
      "The San Francisco Sheriff's Department has a professional appearance policy. Visible tattoos on the face, neck, and hands are generally not permitted while in uniform. Tattoos elsewhere on the body that are not visible in uniform are acceptable. Grooming standards require neat, clean appearance with specific guidelines for hair length, facial hair, and accessories.",
  },
  {
    keywords: ["women", "female", "gender", "diversity"],
    response:
      "The San Francisco Sheriff's Department actively encourages women to apply and has a strong commitment to diversity. Approximately 20% of our deputies are women, which is higher than the national average for law enforcement. We have women serving at all ranks, including leadership positions, and offer mentorship programs specifically for female deputies.",
  },
  {
    keywords: ["drug", "marijuana", "cannabis", "test", "use"],
    response:
      "The department conducts drug testing as part of the medical examination. Recent use of illegal drugs, including marijuana (which remains federally illegal), can disqualify candidates. Policies regarding prior use depend on the substance, how recent the use was, and the extent of use. Each case is evaluated individually during the background investigation.",
  },
  {
    keywords: ["duties", "responsibilities", "job", "role", "day to day"],
    response:
      "Deputy Sheriffs have diverse responsibilities including courthouse security, operating jail facilities, serving legal papers, executing evictions, providing security at City Hall and General Hospital, and transporting prisoners. A typical day varies greatly depending on your assignment, but all roles focus on maintaining safety, security, and order while treating everyone with dignity and respect.",
  },
  {
    keywords: ["difference", "police", "sheriff", "versus", "vs"],
    response:
      "The main difference between the Sheriff's Department and Police Department is jurisdiction and responsibilities. The SFPD handles general law enforcement and crime response throughout the city. The Sheriff's Department manages the jail system, provides court security, serves civil papers, conducts evictions, and provides security for city buildings. Both are vital to public safety but with different focuses.",
  },
  {
    keywords: ["equipment", "gear", "uniform", "provided", "buy"],
    response:
      "The department provides your initial uniform and equipment, including duty weapon, body armor, radio, and other essential gear. Some deputies choose to purchase additional optional equipment. An annual uniform allowance helps with replacement and maintenance of your gear.",
  },
  {
    keywords: ["dangerous", "safety", "risk", "injury", "danger"],
    response:
      "Like all law enforcement careers, being a Deputy Sheriff involves some inherent risks. However, the department prioritizes deputy safety through extensive training, proper equipment, and sound policies and procedures. Many assignments within the department have different risk profiles, and deputies receive specific training for their assignments to minimize risks.",
  },
  {
    keywords: ["family", "children", "work life", "balance", "time off"],
    response:
      "The department recognizes the importance of work-life balance. The various shift options (8-hour shifts with weekends off, 12-hour shifts with 3 days on/4 days off, or 12-hour shifts with 4 days on/3 days off) help many deputies maintain family time. Benefits include paid vacation, sick leave, family medical leave, and parental leave. Many deputies find the schedule and stability of the job conducive to raising a family.",
  },
  // Default response if no keywords match
  {
    keywords: ["default"],
    response:
      "I'm here to help answer your questions about becoming a San Francisco Deputy Sheriff. You can ask me about the application process, requirements, training, benefits, salary, career opportunities, or any other aspects of the job you're curious about.",
  },
];

export function generateResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  // Check each knowledge entry for keyword matches
  for (const entry of knowledgeBase) {
    // Skip the default entry initially
    if (entry.keywords.includes("default")) continue;

    // Check if any keywords match
    if (entry.keywords.some((keyword) => input.includes(keyword))) {
      return entry.response;
    }
  }

  // If no matches, return the default response
  return (
    knowledgeBase.find((entry) => entry.keywords.includes("default"))
      ?.response ||
    "I'm not sure about that, but I'd be happy to help with questions about becoming a San Francisco Deputy Sheriff."
  );
}
