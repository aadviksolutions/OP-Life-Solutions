import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Om Prakash Sahu Insurance Services database...");

  // 1. Clean existing records for fresh seed
  await prisma.activityLog.deleteMany({});
  await prisma.reminderHistory.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.policyDocument.deleteMany({});
  await prisma.policy.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.insuranceCompany.deleteMany({});
  await prisma.adminUser.deleteMany({});
  await prisma.adminSettings.deleteMany({});

  // 2. Admin Settings
  await prisma.adminSettings.create({
    data: {
      id: "default-settings",
      companyName: "Om Prakash Sahu Insurance Services",
      tagline: "YOUR PROTECTION. OUR PRIORITY.",
      logoUrl: "/images/ops-logo.jpg",
      phone: "+91 98261 45892",
      whatsapp: "+91 98261 45892",
      email: "contact@opsinsurance.in",
      address: "Shop No. 12, Commercial Complex, Pandri Market",
      city: "Raipur",
      state: "Chhattisgarh",
      pincode: "492004",
      workingHours: "Mon - Sat: 9:30 AM - 7:30 PM",
      heroHeadline: "Protecting What Matters Most",
      heroSubheading: "Reliable insurance solutions for you, your family and your future.",
      yearsExperience: "15+",
      customersServed: "2500+",
      claimsSupportRate: "99.4%",
      aboutStory: "With over 15 years of dedicated insurance advisory experience in Raipur and throughout Chhattisgarh, Om Prakash Sahu Insurance Services has protected thousands of families and businesses with customized coverage and steadfast claims advocacy.",
      reminderDaysJson: "[30, 15, 7, 1, 0]",
      smsEnabled: false,
      whatsappEnabled: false,
      emailEnabled: false,
    },
  });

  // 3. Admin User
  const passwordHash = await bcrypt.hash("AdminPassword@123", 10);
  const admin = await prisma.adminUser.create({
    data: {
      username: "admin",
      email: "admin@opsinsurance.in",
      passwordHash,
      name: "Om Prakash Sahu",
      role: "SUPER_ADMIN",
      phone: "+91 98261 45892",
    },
  });
  console.log("✅ Super Admin created:", admin.username);

  // 4. Insurance Companies
  const companies = [
    { name: "Star Health & Allied Insurance", code: "STAR", website: "https://www.starhealth.in" },
    { name: "HDFC ERGO General Insurance", code: "HDFCERGO", website: "https://www.hdfcergo.com" },
    { name: "ICICI Lombard General Insurance", code: "ICICILOMBARD", website: "https://www.icicilombard.com" },
    { name: "Life Insurance Corporation of India (LIC)", code: "LIC", website: "https://licindia.in" },
    { name: "Tata AIG General Insurance", code: "TATAAIG", website: "https://www.tataaig.com" },
    { name: "Care Health Insurance", code: "CARE", website: "https://www.careinsurance.com" },
    { name: "Bajaj Allianz General Insurance", code: "BAJAJALLIANZ", website: "https://www.bajajallianz.com" },
    { name: "The New India Assurance Co. Ltd.", code: "NEWINDIA", website: "https://www.newindia.co.in" },
  ];

  for (const c of companies) {
    await prisma.insuranceCompany.create({ data: c });
  }
  console.log("✅ Insurance Companies seeded:", companies.length);

  // 5. Customers
  const now = new Date();
  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  };
  const subDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };

  const cust1 = await prisma.customer.create({
    data: {
      customerId: "OPS-CUST-1001",
      name: "Rajesh Kumar Verma",
      mobile: "9826011223",
      alternateMobile: "9425211990",
      email: "rajesh.verma@example.com",
      address: "B-42, Shankar Nagar",
      city: "Raipur",
      state: "Chhattisgarh",
      pincode: "492007",
      dob: new Date("1982-06-15"),
      notes: "VIP Client. Owns two commercial properties and family cars.",
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      customerId: "OPS-CUST-1002",
      name: "Sunita Agrawal",
      mobile: "9425233445",
      alternateMobile: "9827155667",
      email: "sunita.agrawal@example.com",
      address: "14, Civil Lines Near Circuit House",
      city: "Bilaspur",
      state: "Chhattisgarh",
      pincode: "495001",
      dob: new Date("1978-11-22"),
      notes: "Health & Life policies for complete family. Prefers WhatsApp reminders.",
    },
  });

  const cust3 = await prisma.customer.create({
    data: {
      customerId: "OPS-CUST-1003",
      name: "Amitesh Sharma",
      mobile: "9111255667",
      email: "amitesh.sharma@example.com",
      address: "Street 7, Sector 6",
      city: "Bhilai",
      state: "Chhattisgarh",
      pincode: "490006",
      dob: new Date("1991-03-08"),
      notes: "IT Consultant. Interested in Term Insurance upgrade.",
    },
  });

  const cust4 = await prisma.customer.create({
    data: {
      customerId: "OPS-CUST-1004",
      name: "Priya Dewangan",
      mobile: "9981177889",
      email: "priya.dewangan@example.com",
      address: "Flat 302, Palm Greens, Devendra Nagar",
      city: "Raipur",
      state: "Chhattisgarh",
      pincode: "492004",
      dob: new Date("1989-09-14"),
      notes: "Architect. Active Car and Home insurance.",
    },
  });

  const cust5 = await prisma.customer.create({
    data: {
      customerId: "OPS-CUST-1005",
      name: "Manoj Kumar Patidar",
      mobile: "9755499001",
      email: "patidar.enterprises@example.com",
      address: "Main Road, Ganj Para",
      city: "Rajnandgaon",
      state: "Chhattisgarh",
      pincode: "491441",
      dob: new Date("1974-04-18"),
      notes: "Wholesale distributor. Business liability policy & transit coverage.",
    },
  });

  console.log("✅ Customers seeded: 5");

  // 6. Policies (With varying expiry dates to demonstrate active, expiring soon, expired)
  // Policy 1: Expiring in 5 days (Urgent Gold alert: <= 7 days)
  const pol1 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2001",
      customerId: cust1.id,
      policyType: "MOTOR",
      policyNumber: "HDFC-MOT-889921",
      insuranceCompany: "HDFC ERGO General Insurance",
      purchaseDate: subDays(360),
      startDate: subDays(360),
      expiryDate: addDays(5),
      premiumAmount: 14850,
      sumInsured: 850000,
      vehicleNumber: "CG 04 MX 4421",
      insuredAsset: "Hyundai Creta SX (O) Petrol 2022",
      policyStatus: "EXPIRING_SOON",
      renewalDate: addDays(5),
      agentAdvisor: "Om Prakash Sahu",
      notes: "Client reminded via phone call. Renewal quote sent for ₹13,900.",
    },
  });

  // Policy 2: Expiring in 14 days (Gold alert: <= 15 days)
  const pol2 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2002",
      customerId: cust2.id,
      policyType: "HEALTH",
      policyNumber: "STAR-HLT-445512",
      insuranceCompany: "Star Health & Allied Insurance",
      purchaseDate: subDays(351),
      startDate: subDays(351),
      expiryDate: addDays(14),
      premiumAmount: 26400,
      sumInsured: 1500000,
      insuredAsset: "Family Health Optima (Self + Spouse + 2 Children)",
      policyStatus: "EXPIRING_SOON",
      renewalDate: addDays(14),
      agentAdvisor: "Om Prakash Sahu",
      notes: "Cumulative bonus 20% applicable. Super NCB eligible.",
    },
  });

  // Policy 3: Expiring in 26 days (Alert: <= 30 days)
  const pol3 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2003",
      customerId: cust3.id,
      policyType: "MOTOR",
      policyNumber: "ICICI-MOT-332110",
      insuranceCompany: "ICICI Lombard General Insurance",
      purchaseDate: subDays(339),
      startDate: subDays(339),
      expiryDate: addDays(26),
      premiumAmount: 11200,
      sumInsured: 620000,
      vehicleNumber: "CG 07 KL 9001",
      insuredAsset: "Tata Nexon XZ Plus Diesel 2021",
      policyStatus: "ACTIVE",
      renewalDate: addDays(26),
      agentAdvisor: "Om Prakash Sahu",
    },
  });

  // Policy 4: Expired 8 days ago (Red alert: Expired)
  const pol4 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2004",
      customerId: cust4.id,
      policyType: "TRAVEL",
      policyNumber: "TATAAIG-TRV-118833",
      insuranceCompany: "Tata AIG General Insurance",
      purchaseDate: subDays(45),
      startDate: subDays(45),
      expiryDate: subDays(8),
      premiumAmount: 4850,
      sumInsured: 2500000,
      insuredAsset: "International Travel Policy - Schengen & UK (14 Days)",
      policyStatus: "EXPIRED",
      renewalDate: null,
      agentAdvisor: "Om Prakash Sahu",
      notes: "Single trip travel coverage expired after return.",
    },
  });

  // Policy 5: Active, healthy (Expiring in 7 months)
  const pol5 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2005",
      customerId: cust1.id,
      policyType: "LIFE",
      policyNumber: "LIC-JEV-772299",
      insuranceCompany: "Life Insurance Corporation of India (LIC)",
      purchaseDate: subDays(150),
      startDate: subDays(150),
      expiryDate: addDays(215),
      premiumAmount: 48500,
      sumInsured: 2500000,
      insuredAsset: "LIC Jeevan Labh (Table 936) - 21 Year Term",
      policyStatus: "ACTIVE",
      renewalDate: addDays(215),
      agentAdvisor: "Om Prakash Sahu",
      notes: "Annual ECS auto-debit enabled with State Bank of India.",
    },
  });

  // Policy 6: Home Insurance (Active)
  const pol6 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2006",
      customerId: cust4.id,
      policyType: "HOME",
      policyNumber: "ICICI-HOM-990011",
      insuranceCompany: "ICICI Lombard General Insurance",
      purchaseDate: subDays(120),
      startDate: subDays(120),
      expiryDate: addDays(245),
      premiumAmount: 8900,
      sumInsured: 6500000,
      insuredAsset: "Residential Villa Structure & Contents, Palm Greens",
      policyStatus: "ACTIVE",
      renewalDate: addDays(245),
      agentAdvisor: "Om Prakash Sahu",
    },
  });

  // Policy 7: Business Commercial Insurance (Active, expiring in 32 days)
  const pol7 = await prisma.policy.create({
    data: {
      policyId: "OPS-POL-2007",
      customerId: cust5.id,
      policyType: "BUSINESS",
      policyNumber: "BAJAJ-BUS-556622",
      insuranceCompany: "Bajaj Allianz General Insurance",
      purchaseDate: subDays(333),
      startDate: subDays(333),
      expiryDate: addDays(32),
      premiumAmount: 38700,
      sumInsured: 12000000,
      insuredAsset: "Commercial Warehouse & Stock Fire / Burglary Package",
      policyStatus: "ACTIVE",
      renewalDate: addDays(32),
      agentAdvisor: "Om Prakash Sahu",
      notes: "Inspection completed. Advance renewal notice to be sent next week.",
    },
  });

  console.log("✅ Policies seeded: 7");

  // 7. Policy Documents
  await prisma.policyDocument.create({
    data: {
      policyId: pol1.id,
      customerId: cust1.id,
      title: "HDFC ERGO Motor Policy Schedule (Original)",
      documentType: "POLICY_PDF",
      fileUrl: "/sample-documents/hdfc-creta-policy.pdf",
      fileName: "HDFC_ERGO_Creta_Policy_2025.pdf",
      fileSize: 482000,
      mimeType: "application/pdf",
    },
  });

  await prisma.policyDocument.create({
    data: {
      policyId: pol2.id,
      customerId: cust2.id,
      title: "Star Health Family Health Optima e-Card & Policy",
      documentType: "POLICY_PDF",
      fileUrl: "/sample-documents/star-health-family-optima.pdf",
      fileName: "StarHealth_FamilyOptima_Schedule.pdf",
      fileSize: 615000,
      mimeType: "application/pdf",
    },
  });

  await prisma.policyDocument.create({
    data: {
      policyId: pol5.id,
      customerId: cust1.id,
      title: "LIC Jeevan Labh Policy Bond Document",
      documentType: "POLICY_PDF",
      fileUrl: "/sample-documents/lic-jeevan-labh-bond.pdf",
      fileName: "LIC_Jeevan_Labh_Bond_772299.pdf",
      fileSize: 1240000,
      mimeType: "application/pdf",
    },
  });

  console.log("✅ Policy Documents seeded: 3");

  // 8. Reminders & History
  const r1 = await prisma.reminder.create({
    data: {
      policyId: pol1.id,
      customerId: cust1.id,
      reminderType: "EXPIRY_7",
      scheduledDate: subDays(2),
      channel: "WHATSAPP",
      status: "SENT",
      sentAt: subDays(2),
      notes: "WhatsApp reminder sent for Hyundai Creta renewal. Customer responded.",
    },
  });

  await prisma.reminderHistory.create({
    data: {
      reminderId: r1.id,
      policyId: pol1.id,
      customerId: cust1.id,
      channel: "WHATSAPP",
      recipient: "9826011223",
      messageBody: "Dear Rajesh Verma ji, your Hyundai Creta Insurance (Pol #HDFC-MOT-889921) expires on " + addDays(5).toLocaleDateString("en-IN") + ". Kindly contact Om Prakash Sahu Insurance Services for seamless zero-dep renewal.",
      status: "DELIVERED",
      sentAt: subDays(2),
    },
  });

  const r2 = await prisma.reminder.create({
    data: {
      policyId: pol2.id,
      customerId: cust2.id,
      reminderType: "EXPIRY_15",
      scheduledDate: subDays(1),
      channel: "SMS",
      status: "SENT",
      sentAt: subDays(1),
      notes: "SMS renewal notice sent to Sunita Agrawal.",
    },
  });

  await prisma.reminderHistory.create({
    data: {
      reminderId: r2.id,
      policyId: pol2.id,
      customerId: cust2.id,
      channel: "SMS",
      recipient: "9425233445",
      messageBody: "Namaste Sunita ji, your Star Health insurance renewal is due in 15 days. Call Om Prakash Sahu at +91 98261 45892 for cashless continuity.",
      status: "SENT",
      sentAt: subDays(1),
    },
  });

  console.log("✅ Reminders & Logs seeded");

  // 9. Enquiries
  await prisma.enquiry.create({
    data: {
      name: "Gaurav Chandrakar",
      mobile: "9406088991",
      email: "gaurav.ch@gmail.com",
      insuranceType: "Health",
      message: "Looking for comprehensive health insurance of ₹20 Lakhs for my parents (aged 62 and 58). Please advise best plan.",
      status: "NEW",
    },
  });

  await prisma.enquiry.create({
    data: {
      name: "Rameshwar Sahu",
      mobile: "9827966778",
      email: "rameshwar.sahu@gmail.com",
      insuranceType: "Motor",
      message: "Need comprehensive policy renewal quote for Mahindra Scorpio-N with Return to Invoice and Engine Protect add-on.",
      status: "CONTACTED",
      notes: "Called on 4th Oct. Provided Tata AIG and ICICI quotes. Client comparing.",
    },
  });

  // 10. Activity Log
  await prisma.activityLog.create({
    data: {
      adminUserId: admin.id,
      action: "SEED_DATABASE",
      entity: "SYSTEM",
      entityId: "SYSTEM-INIT",
      details: "Initial system configuration and realistic demo data populated.",
    },
  });

  console.log("🎉 Seeding complete! Database is ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
