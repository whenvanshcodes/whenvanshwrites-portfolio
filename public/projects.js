'use strict';
const projects = [
  {
    "id": "signal",
    "number": "01",
    "title": "Signal to Saturday",
    "room": "founder",
    "tag": "PRODUCT DEVELOPMENT",
    "type": "live",
    "summary": "CRM and analytics for offline gaming venues, connecting bookings, customer relationships and operational reporting.",
    "stack": [
      "React",
      "Python",
      "MongoDB"
    ],
    "intro": "A CRM and analytics product for offline gaming parlours, built end to end and being used by 6–20 parlours. Signal to Saturday is the portfolio name for this work.",
    "question": "How can a gaming parlour bring its customers, bookings, events, and operating data into one useful system?",
    "work": [
      "Owned the product idea and research, frontend and user experience, backend, database, CRM workflows, and analytics dashboard.",
      "Built workflows for walk-ins and bookings, customer profiles and follow-ups, group sessions, tournaments and events, memberships, and repeat visits.",
      "Covered console lounges, PC gaming cafés, arcades, and board-game or VR venues."
    ],
    "evidence": "The dashboard brings together busy periods and slot utilization, returning customers, bookings and event attendance, and revenue by customer or activity.",
    "outcome": "In use across 6–20 parlours. Before-and-after data, CRM records, and owner feedback showed better slot utilization and more bookings or event attendance.",
    "featured": true
  },
  {
    "id": "operations",
    "number": "02",
    "title": "Operational workflow automation",
    "room": "founder",
    "tag": "SYSTEMS & OPERATIONS",
    "summary": "Structured trackers, automated workflows and reporting to reduce repetitive work and improve cross-team handoffs.",
    "stack": [
      "Automation",
      "Databases",
      "Workflow design"
    ],
    "intro": "An anonymized startup operations case study, centered on reducing repetitive manual work.",
    "question": "Which recurring manual steps can become a clearer, more dependable operating process?",
    "work": [
      "Found and defined the problem, analyzed data, researched the context, and designed a workflow or recommendation.",
      "Helped build a structured database or tracker, automated workflows, and a reporting dashboard.",
      "Coordinated people and implementation, including clearer processes and handoffs."
    ],
    "evidence": "The work reached a working version, with attention to adoption as well as the system itself.",
    "outcome": "Reported outcomes included faster work, fewer errors or missed items, an adopted process, and easier decisions. Company details and numerical results remain private.",
    "featured": true
  },
  {
    "id": "growth",
    "number": "03",
    "title": "Growth analysis & product prioritisation",
    "room": "founder",
    "tag": "BUSINESS ANALYSIS",
    "summary": "Research and business analysis supporting growth recommendations and product decisions at an early-stage startup.",
    "stack": [
      "Product management",
      "Growth analysis"
    ],
    "intro": "An anonymized view of growth analysis and product management carried out as part of startup work.",
    "question": "What can a startup learn from the market before choosing where to focus its growth efforts?",
    "work": [
      "Contributed growth analysis and product management.",
      "Worked across business analysis and startup execution, connecting research with recommendations."
    ],
    "evidence": "This entry focuses on the research work and the business questions behind it. Private company findings are not reproduced.",
    "outcome": "Research connected market questions with recommendations for an early-stage startup.",
    "featured": false
  },
  {
    "id": "billing",
    "number": "04",
    "title": "Billing & settlement workflows",
    "room": "founder",
    "tag": "FINANCE OPERATIONS",
    "summary": "Internal billing processes connecting structured records, workflow design and cross-team execution.",
    "stack": [
      "Workflow design",
      "Billing systems",
      "Operations"
    ],
    "intro": "An anonymized startup workstream covering billing and finance workflows.",
    "question": "How can billing information and finance handoffs become easier to manage across a team?",
    "work": [
      "Contributed to billing and finance workflows alongside automation, databases, and cross-team operations.",
      "Connected business process needs with the design and implementation of internal systems."
    ],
    "evidence": "The public entry describes the scope of the contribution while keeping internal financial information private.",
    "outcome": "Connected business process needs, internal data, and implementation across billing and finance workflows.",
    "featured": false
  },
  {
    "id": "city",
    "number": "05",
    "title": "City Buddy",
    "room": "data",
    "tag": "CIVIC TECHNOLOGY",
    "summary": "A city-services platform combining local discovery, maps, public information and moderated complaints.",
    "stack": [
      "Java",
      "MySQL",
      "HTML / CSS / JS",
      "Leaflet"
    ],
    "intro": "A city-services project bringing local information and public-service discovery into a web experience.",
    "question": "How can residents find city services and local information through one interface?",
    "work": [
      "Developed the project around a Java and MySQL backend with an HTML, CSS, and JavaScript frontend.",
      "Included map-based discovery using Leaflet, weather and news APIs, and city service information.",
      "Scoped a complaint-only community forum with admin approval."
    ],
    "evidence": "The product scope brings together maps, service categories, city information, and community complaint workflows.",
    "outcome": "A civic-tech interface connecting service discovery, city information, and a moderated complaint community.",
    "featured": true
  },
  {
    "id": "tickets",
    "number": "06",
    "title": "Quick Tickets",
    "room": "data",
    "tag": "FULL-STACK DEVELOPMENT",
    "summary": "A MERN ticket-booking application connecting login, seat selection and Razorpay payments.",
    "stack": [
      "MongoDB",
      "Express",
      "React",
      "Node.js",
      "Razorpay"
    ],
    "intro": "A MERN event-ticketing platform with an integrated booking flow.",
    "question": "How can an event-booking experience connect discovery, seat selection, and payment?",
    "work": [
      "Built event listings, login, and seat selection.",
      "Used REST APIs to connect the application’s flows.",
      "Integrated Razorpay for payment functionality."
    ],
    "evidence": "The project combines the customer-facing booking journey with application and payment integration.",
    "outcome": "Brought the event journey together: listings, authentication, seat selection, and payment integration.",
    "featured": true
  },
  {
    "id": "churn",
    "number": "07",
    "title": "Customer churn prediction",
    "room": "data",
    "tag": "CUSTOMER ANALYTICS",
    "summary": "Exploratory analysis, feature engineering and model comparison using the Telco customer churn dataset.",
    "stack": [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "XGBoost"
    ],
    "intro": "A customer churn prediction project using the Telco dataset.",
    "question": "Which customer patterns help distinguish likely churn, and how do different classifiers compare?",
    "work": [
      "Performed exploratory data analysis and feature engineering with Pandas and NumPy.",
      "Compared Logistic Regression, Random Forest and XGBoost on the Telco customer churn dataset.",
      "Evaluated the models with F1-score and ROC-AUC."
    ],
    "evidence": "The analytical focus is on patterns, features, and classification performance, rather than relying on a single accuracy number.",
    "outcome": "Compared classifiers using F1 and ROC-AUC, with exploratory analysis and feature engineering shaping the work.",
    "featured": false,
    "repository": "https://github.com/whenvanshcodes/churn-predcition"
  },
  {
    "id": "fraud",
    "number": "08",
    "title": "Credit card fraud detection",
    "room": "data",
    "tag": "MACHINE LEARNING",
    "summary": "Classification of imbalanced transaction data, with attention to precision, F1 and minority-class detection.",
    "stack": [
      "Python",
      "Scikit-learn",
      "XGBoost",
      "SMOTE"
    ],
    "intro": "A classification project focused on identifying fraudulent credit card transactions.",
    "question": "How can a classifier identify rare fraudulent transactions in an imbalanced dataset?",
    "work": [
      "Built a fraud-classification model using SMOTE and XGBoost.",
      "Evaluated precision, recall, F1-score and ROC-AUC.",
      "Visualized model results with Seaborn and Matplotlib."
    ],
    "evidence": "The project centers on detecting the minority class and evaluating more than headline accuracy.",
    "outcome": "Explored rare-event classification using imbalance treatment and precision-focused model evaluation.",
    "featured": false,
    "repository": "https://github.com/whenvanshcodes/cc-fraud"
  },
  {
    "id": "currency",
    "number": "09",
    "title": "Currency authenticity classification",
    "room": "data",
    "tag": "COMPUTER VISION",
    "summary": "An image-classification project exploring convolutional neural networks for real-versus-fake currency detection.",
    "stack": [
      "Python",
      "CNN",
      "Image classification"
    ],
    "intro": "A fake currency detection project using a convolutional neural network approach.",
    "question": "What can an image-based model learn about the difference between real and fake currency examples?",
    "work": [
      "Worked on real-versus-fake image classification with a MobileNetV2 or related CNN approach.",
      "Explored image preparation, model training, and prediction behavior."
    ],
    "evidence": "An exploratory computer-vision project centered on image-based detection, model training, and prediction behavior.",
    "outcome": "Explored image classification for currency authenticity and the limits of model generalization.",
    "featured": false
  },
  {
    "id": "business",
    "number": "10",
    "title": "Operations & performance analysis",
    "room": "data",
    "tag": "BUSINESS ANALYTICS",
    "summary": "An analytical project focused on interpreting operating performance and identifying questions for business decisions.",
    "stack": [
      "Business analysis",
      "Data analysis",
      "Performance"
    ],
    "intro": "An operations-focused business analytics project examining performance interpretation and decision support.",
    "question": "What do operating and performance measures tell us about where to investigate or improve?",
    "work": [
      "Project focus: operations, performance interpretation and decision support."
    ],
    "evidence": "The public overview describes the analytical focus. Detailed source data, methods and findings have not been published.",
    "outcome": "An operations and performance analysis project organized around business questions and decision support.",
    "featured": false
  }
];
