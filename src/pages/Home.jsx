import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
// ─── DATA ────────────────────────────────────────────────────────────────────

const TREATMENTS = [
  {
    id: "root-canal",
    title: "Root Canal Treatment",
    emoji: "🦷",
    tagline: "Pain-free infection removal with advanced microscopic dentistry.",
    desc: "Our painless root canal treatment removes infection and saves your natural tooth using cutting-edge rotary instruments and digital X-rays.",
    bullets: [
      "Microscopic precision technology",
      "Single-sitting procedures available",
      "Bio-ceramic sealers for longevity",
      "Zero pain guarantee",
    ],
    img: "https://images.unsplash.com/photo-1588776814546-ec7e7b2f8b94?q=80&w=1200&auto=format&fit=crop",
    price: "₹3,500 onwards",
  },
  {
    id: "dental-implants",
    title: "Dental Implants",
    emoji: "⚙️",
    tagline: "Permanent tooth replacement that looks and feels natural.",
    desc: "Titanium implants fused with your jawbone to create a strong, permanent foundation. Restore your smile with teeth that last a lifetime.",
    bullets: [
      "Swiss & Korean titanium implants",
      "3D CBCT scan guided placement",
      "Immediate loading options",
      "10-year implant warranty",
    ],
    img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop",
    price: "₹18,000 onwards",
  },
  {
    id: "invisalign",
    title: "Invisalign & Clear Aligners",
    emoji: "😁",
    tagline: "Straighten teeth discreetly — no metal, no discomfort.",
    desc: "Custom-crafted clear aligners that progressively shift your teeth to their ideal position. Nearly invisible and removable for eating & cleaning.",
    bullets: [
      "3D smile simulation before starting",
      "Removable for eating & brushing",
      "Bi-weekly aligner progression",
      "Suitable for teens & adults",
    ],
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop",
    price: "₹45,000 onwards",
  },
  {
    id: "teeth-whitening",
    title: "Teeth Whitening",
    emoji: "✨",
    tagline: "Professional-grade whitening for a brilliantly bright smile.",
    desc: "In-office laser whitening and take-home kits customized to your shade goals. Safe, fast results with enamel protection built-in.",
    bullets: [
      "Up to 8 shades brighter in 1 hour",
      "Laser-activated professional system",
      "Custom tray take-home maintenance",
      "Sensitive-teeth-friendly formula",
    ],
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
    price: "₹4,000 onwards",
  },
  {
    id: "smile-designing",
    title: "Smile Designing",
    emoji: "💫",
    tagline: "Transform your entire smile with cosmetic dentistry artistry.",
    desc: "A complete smile makeover combining veneers, bonding, whitening, and gum contouring — designed around your face shape and personality.",
    bullets: [
      "Digital smile preview before treatment",
      "Porcelain & composite veneers",
      "Gum reshaping & contouring",
      "Hollywood smile expertise",
    ],
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop",
    price: "₹12,000 onwards",
  },
  {
    id: "kids-dentistry",
    title: "Kids Dentistry",
    emoji: "🍭",
    tagline: "Gentle, fun dental care that children actually enjoy.",
    desc: "A child-friendly environment with cartoon-painted walls, gentle techniques, and dentists trained in pediatric behavior management.",
    bullets: [
      "No-fear, play-based approach",
      "Fluoride & sealant protection",
      "Early orthodontic assessment",
      "Nitrous oxide sedation available",
    ],
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop",
    price: "₹800 onwards",
  },
];

const REVIEWS = [
  { name: "Arun Kumar", location: "Tiruppur", rating: 5, text: "Best dental clinic I've visited. The root canal was completely painless — I was shocked! Staff is very professional and caring." },
  { name: "Priya Suresh", location: "Coimbatore", rating: 5, text: "Got my Invisalign treatment done here. The 3D preview before starting gave me total confidence. Highly recommend Dr. Ram!" },
  { name: "Ramesh B", location: "Tiruppur", rating: 5, text: "My son was terrified of dentists. The kids section completely changed his mind. He now looks forward to checkups!" },
  { name: "Kavitha M", location: "Erode", rating: 5, text: "Smile design turned out exactly as shown in the digital preview. I couldn't stop smiling for weeks after!" },
  { name: "Senthil R", location: "Tiruppur", rating: 5, text: "Got implants done here after visiting multiple clinics. Ram Dental's pricing and quality is unmatched in the region." },
  { name: "Deepa N", location: "Salem", rating: 5, text: "Clean, hygienic, modern clinic. Teeth whitening results were incredible — 8 shades up in just one session!" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StarRating({ count = 5 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

function TreatmentPage({ treatment, onBack }) {
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", message: "" });

  // const handleBook = () => {
  //   if (form.name && form.phone) setBooked(true);
  // };
  const handleBook = async () => {
  if (form.name && form.phone) {
    try {
      await addDoc(collection(db, "appointments"), {
        patient: form.name,
        phone: form.phone,
        treatment: treatment.name,
        date: form.date || "TBD",
        message: form.message,
        status: "Pending",
        createdAt: new Date(),
      });

      setBooked(true);

    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to book appointment.");
    }
  }
};

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#fff", minHeight: "100vh" }}>
      {/* Back bar */}
      <div style={{ background: "#1e3a5f", padding: "14px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 14 }}
        >
          ← Back to Home
        </button>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Ram Dental Clinic / {treatment.name}</span>
      </div>

{/* Hero */}
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      window.innerWidth < 900
        ? "1fr"
        : "1fr 1fr",
    minHeight: 500,
    background:
      "linear-gradient(135deg, #0f2441 0%, #1e3a5f 50%, #0e6e8c 100%)",
  }}
>  <div style={{ padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.1)",
      borderRadius: 999,
      padding: "6px 16px",
      width: "fit-content",
      marginBottom: 20
    }}>
      <span style={{ fontSize: 22 }}>🦷</span>

      <span style={{
        color: "#7dd3fc",
        fontSize: 13,
        fontFamily: "sans-serif",
        letterSpacing: "0.1em",
        textTransform: "uppercase"
      }}>
        Specialized Treatment
      </span>
    </div>

    <h1 style={{
      fontSize: 48,
      fontWeight: 700,
      color: "#fff",
      lineHeight: 1.2,
      marginBottom: 16
    }}>
      {treatment.name}
    </h1>

    <p style={{
      fontSize: 18,
      color: "#93c5fd",
      marginBottom: 24,
      fontStyle: "italic"
    }}>
      {treatment.description}
    </p>

    <div style={{
      display: "inline-block",
      background: "rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "12px 20px",
      marginBottom: 28
    }}>
      <span style={{
        color: "#fbbf24",
        fontFamily: "sans-serif",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: "0.1em"
      }}>
        Starting from
      </span>

      <div style={{
        color: "#fff",
        fontSize: 28,
        fontWeight: 700
      }}>
        {treatment.price}
      </div>
    </div>

  </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img src={treatment.image} alt={treatment.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #1e3a5f 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", bottom: 32, right: 32, background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: "20px 28px", backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f" }}>10K+</div>
            <div style={{ color: "#64748b", fontSize: 14, fontFamily: "sans-serif" }}>Happy Patients</div>
          </div>
        </div>
      </div>

      {/* Booking form */}
      <div style={{ maxWidth: 700, margin: "64px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, color: "#1e3a5f", marginBottom: 8 }}>Book a Consultation</h2>
          <p style={{ color: "#64748b", fontFamily: "sans-serif" }}>Fill in your details and we'll confirm your appointment within 2 hours.</p>
        </div>

        {booked ? (
          <div style={{ background: "#ecfdf5", border: "2px solid #6ee7b7", borderRadius: 20, padding: "48px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 28, color: "#065f46", marginBottom: 8 }}>Appointment Requested!</h3>
            <p style={{ color: "#047857", fontFamily: "sans-serif" }}>Thank you, {form.name}! We'll call you at {form.phone} to confirm your {treatment.name} appointment.</p>
            <button onClick={onBack} style={{ marginTop: 24, background: "#059669", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, cursor: "pointer", fontFamily: "sans-serif" }}>← Back to Home</button>
          </div>
        ) : (
          <div style={{ background: "#f8fafc", borderRadius: 24, padding: 40, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <input
                placeholder="Your Name *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Phone Number *"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                style={inputStyle}
              />
            </div>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              style={{ ...inputStyle, width: "100%", marginBottom: 16, boxSizing: "border-box" }}
            />
            <textarea
              placeholder="Any specific concern or message..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle, width: "100%", height: 100, resize: "vertical", marginBottom: 20, boxSizing: "border-box" }}
            />
            <button
              onClick={handleBook}
              style={{ width: "100%", background: "linear-gradient(135deg, #1e3a5f, #0e6e8c)", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 600 }}
            >
              Book {treatment.name} Consultation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "14px 16px",
  fontSize: 15,
  fontFamily: "sans-serif",
  background: "#fff",
  color: "#000",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTreatment, setActiveTreatment] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
  name: "",
  phone: "",
  date: "",
  treatment: "",
  slot: "",
  message: "",
});
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);
  const [clinicTiming, setClinicTiming] = useState({
  weekdays: "",
  sunday: "",
  emergency: "",
});
const [contactDetails, setContactDetails] = useState({
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  location: "",
});
  const [treatments, setTreatments] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [showAllTransformations, setShowAllTransformations] =
  useState(false);


  const fetchTreatments = async () => {

  const querySnapshot = await getDocs(
    collection(db, "treatments")
  );

  const treatmentList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setTreatments(treatmentList);
};

const fetchTransformations = async () => {

  const querySnapshot = await getDocs(
    collection(db, "transformations")
  );

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setTransformations(data);
};
const fetchClinicTiming = async () => {

  const docRef = doc(db, "settings", "clinicTiming");

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setClinicTiming(docSnap.data());
  }
};
const fetchContactDetails = async () => {

  const docRef = doc(db, "settings", "contactDetails");

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setContactDetails(docSnap.data());
  }
};
useEffect(() => {
  fetchTreatments();
  fetchClinicTiming();
  fetchContactDetails();
  fetchTransformations();
}, []);

  // const [appointments, setAppointments] = useState([
  //   { patient: "Arun Kumar", treatment: "Root Canal", time: "10:30 AM", date: "Today", status: "Pending" },
  //   { patient: "Priya S", treatment: "Invisalign", time: "12:00 PM", date: "Today", status: "Approved" },
  //   { patient: "Ramesh B", treatment: "Kids Checkup", time: "2:30 PM", date: "Today", status: "Pending" },
  // ]);
  const [appointments, setAppointments] = useState([]);
  const [showTreatments, setShowTreatments] = useState(false);
  useEffect(() => {
  fetchAppointments();
}, []);

const fetchAppointments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "appointments"));

    const appointmentList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAppointments(appointmentList);

  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
};

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ email: "", pass: "", loggedIn: false, error: "" });
  const [newTreatment, setNewTreatment] = useState({
  name: "",
  price: "",
  description: "",
  image: "",
});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTreatment]);

  if (activeTreatment) {
    return <TreatmentPage treatment={activeTreatment} onBack={() => setActiveTreatment(null)} />;
  }

  
  const handleAdminLogin = () => {
  if (adminLogin.email === "doctor@ram.com" && adminLogin.pass === "ram123") {
    setAdminLogin({ ...adminLogin, loggedIn: true, error: "" });
  } else {
    setAdminLogin({ ...adminLogin, error: "Invalid credentials. Try doctor@ram.com / ram123" });
  }
};

const addTreatment = async () => {
  try {
    await addDoc(collection(db, "treatments"), {
      name: newTreatment.name,
      price: newTreatment.price,
      description: newTreatment.description,
      image: newTreatment.image,
    });

    fetchTreatments();

    setNewTreatment({
      name: "",
      price: "",
      description: "",
      image: "",
    });

    alert("Treatment added successfully!");

  } catch (error) {
    console.error(error);
    alert("Failed to add treatment.");
  }
};
const deleteTreatment = async (id) => {
  try {
    await deleteDoc(doc(db, "treatments", id));

    fetchTreatments();

    alert("Treatment deleted!");

  } catch (error) {
    console.error(error);
    alert("Failed to delete treatment.");
  }
};

  const approveAppt = (i) => {
    const u = [...appointments]; u[i].status = "Approved"; setAppointments(u);
  };
  const cancelAppt = (i) => {
    const u = [...appointments]; u[i].status = "Cancelled"; setAppointments(u);
  };

  // const handleBooking = () => {
  //   if (appointmentForm.name && appointmentForm.phone) {
  //     if (appointmentForm.treatment) {
  //       setAppointments([...appointments, {
  //         patient: appointmentForm.name,
  //         treatment: appointmentForm.treatment,
  //         time: "Pending confirmation",
  //         date: appointmentForm.date || "TBD",
  //         status: "Pending",
  //       }]);
  //     }
  //     setAppointmentSubmitted(true);
  //     setAppointmentForm({ name: "", phone: "", date: "", treatment: "", message: "" });
  //   }
  // };
  const handleBooking = async () => {
  if (appointmentForm.name && appointmentForm.phone) {
    try {
      await addDoc(collection(db, "appointments"), {
  patient: appointmentForm.name,
  phone: appointmentForm.phone,
  treatment: appointmentForm.treatment,
  slot: appointmentForm.slot,
  date: appointmentForm.date || "TBD",
  message: appointmentForm.message,
  status: "Pending",
  createdAt: new Date(),
});

      setAppointments([
        ...appointments,
        {
  patient: appointmentForm.name,
  treatment: appointmentForm.treatment,
  slot: appointmentForm.slot,
  time: "Pending confirmation",
  date: appointmentForm.date || "TBD",
  status: "Pending",
}
      ]);
const message = `
Hello Ram Dental Clinic

Name: ${appointmentForm.name}
Phone: ${appointmentForm.phone}
Treatment: ${appointmentForm.treatment}
Preferred Date: ${appointmentForm.date}
Time Slot: ${appointmentForm.slot}

Message:
${appointmentForm.message}
`;

window.open(
  `https://wa.me/${contactDetails.whatsapp}?text=${encodeURIComponent(message)}`,
  "_blank"
);
      setAppointmentSubmitted(true);
      fetchAppointments();

      setAppointmentForm({
        name: "",
        phone: "",
        date: "",
        treatment: "",
        message: "",
      });

    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to book appointment.");
    }
  }
};

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#fff", color: "#1e293b" }}>

      {/* ── NAVBAR ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1e3a5f", letterSpacing: "-0.5px" }}>🦷 Ram Dental Clinic</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Advanced Dental Care</div>
          </div>

          {/* Desktop Nav */}
          <nav
  style={{
    display:
      window.innerWidth < 900
        ? "none"
        : "flex",
    gap: 32,
    alignItems: "center",
    fontFamily: "sans-serif",
    fontSize: 15,
  }}
>
            <a href="#home" style={navLink}>Home</a>
            <div
  style={{ position: "relative" }}
  className="treatment-dropdown"
  onMouseEnter={() => setShowTreatments(true)}
  onMouseLeave={() => setShowTreatments(false)}
>
  <span style={{ ...navLink, cursor: "pointer" }}>
    Treatments ▾
  </span>

  {showTreatments && (
    <div
      style={{
        position: "absolute",
        top: 32,
        left: 0,
        background: "#fff",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        borderRadius: 16,
        padding: 12,
        minWidth: 260,
        zIndex: 200,
        border: "1px solid #f1f5f9",
      }}
    >
      {treatments.map((t) => (
        <div
          key={t.id}
          onClick={() => setActiveTreatment(t)}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "sans-serif",
            color: "#1e3a5f",
            fontSize: 14,
            marginBottom: 6,
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#f1f5f9")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {t.name}
        </div>
      ))}
    </div>
  )}
</div>
            <a href="#about" style={navLink}>About</a>
            <a href="#reviews" style={navLink}>Reviews</a>
            <a href="#contact" style={navLink}>Contact</a>
          </nav>

          <a href="#contact">
            <button style={{ background: "linear-gradient(135deg, #1e3a5f, #0e6e8c)", color: "#fff", border: "none", borderRadius: 10, padding:
  window.innerWidth < 900
    ? "10px 14px"
    : "10px 22px", fontSize: 14, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 600 }}>
              📅 Book Appointment
            </button>
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="home" style={{ background: "linear-gradient(135deg, #0f2441 0%, #1e3a5f 60%, #0e6e8c 100%)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(14,110,140,0.4) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 16px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ color: "#fbbf24" }}>★★★★★</span>
              <span style={{ color: "#e0f2fe", fontFamily: "sans-serif", fontSize: 13 }}>500+ Five-Star Reviews</span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
              Creating Healthy &<br />
              <span style={{ color: "#7dd3fc" }}>Beautiful Smiles</span>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: 36, fontFamily: "sans-serif" }}>
              Modern dental treatments with advanced equipment, experienced doctors, and patient-first care in the heart of Tiruppur.
            </p>
            <div style={{ display: "flex",
gap: 16,
flexWrap: "wrap",
flexDirection:
  window.innerWidth < 900
    ? "column"
    : "row"}}>
              <a href="#contact">
                <button style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1e3a5f", border: "none", borderRadius: 12, padding: "16px 32px", fontSize: 16, cursor: "pointer", fontWeight: 700, fontFamily: "sans-serif" }}>
                  📅 Book Appointment
                </button>
              </a>
              <a href="tel:+919876543210">
                <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "16px 32px", fontSize: 16, cursor: "pointer", fontFamily: "sans-serif" }}>
                  📞 Call Clinic
                </button>
              </a>
            </div>
            <div style={{ display: "flex", gap: 40, marginTop: 48, fontFamily: "sans-serif" }}>
              {[["10K+", "Happy Patients"], ["15+", "Years Experience"], ["25+", "Treatments"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24" }}>{n}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
              alt="Ram Dental Clinic"
              style={{ width: "100%", height:window.innerWidth < 900? 320: 520, objectFit: "cover", borderRadius: 32, boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}
            />
            <div style={{ position: "absolute", bottom: -20, left: -20, background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 32 }}>🏆</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15 }}>Best Dental Clinic</div>
                  <div style={{ color: "#64748b", fontSize: 13, fontFamily: "sans-serif" }}>Tiruppur District 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns:window.innerWidth < 900? "1fr": "repeat(4, 1fr)", gap: 24 }}>
          {[
            ["🔬", "Advanced Technology", "Digital X-ray, CBCT scan, laser dentistry"],
            ["👨‍⚕️", "Expert Doctors", "MDS-qualified specialists for every treatment"],
            ["🛡️", "Safe & Hygienic", "International sterilization standards"],
            ["📅", "Easy Booking", "Online appointment in under 60 seconds"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "#64748b", fontSize: 14, fontFamily: "sans-serif", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TREATMENTS ── */}
      <section id="treatments" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0e6e8c", marginBottom: 12 }}>SPECIALIZED CARE</div>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#1e3a5f", marginBottom: 16 }}>Our Treatments</h2>
            <p style={{ color: "#64748b", fontSize: 17, fontFamily: "sans-serif", maxWidth: 500, margin: "0 auto" }}>Click any treatment to see full details and book a consultation.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns:
  window.innerWidth < 900
    ? "1fr"
    : "repeat(3, 1fr)", gap: 28 }}>
           {treatments.map(t => (
  <div
    key={t.id}
    onClick={() => setActiveTreatment(t)}
    style={{
      borderRadius: 24,
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      cursor: "pointer",
      transition: "transform 0.2s",
      border: "1px solid #f1f5f9",
      background: "#fff"
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ position: "relative" }}>
      <img
        src={t.image}
        alt={t.name}
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 10,
          padding: "6px 12px",
          fontSize: 13,
          fontWeight: 600,
          color: "#1e3a5f",
          fontFamily: "sans-serif"
        }}
      >
        {t.price}
      </div>
    </div>

    <div style={{ padding: "24px 24px 28px" }}>
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#1e3a5f",
          marginBottom: 8
        }}
      >
        {t.name}
      </h3>

      <p
        style={{
          color: "#64748b",
          fontSize: 14,
          fontFamily: "sans-serif",
          lineHeight: 1.6,
          marginBottom: 16
        }}
      >
        {t.description}
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#0e6e8c",
          fontFamily: "sans-serif",
          fontSize: 14,
          fontWeight: 600
        }}
      >
        View Details & Book →
      </div>
    </div>
  </div>
))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "96px 24px", background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns:
  window.innerWidth < 900
    ? "1fr"
    : "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1200&auto=format&fit=crop"
              alt="Our Clinic"
              style={{ width: "100%", height: 520, objectFit: "cover", borderRadius: 32, boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
            />
            <div style={{ position: "absolute", bottom: 32, right: -28, background: "#fff", borderRadius: 20, padding: "20px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f" }}>15+</div>
              <div style={{ color: "#64748b", fontFamily: "sans-serif", fontSize: 13 }}>Years of Experience</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "sans-serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0e6e8c", marginBottom: 12 }}>ABOUT US</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1e3a5f", marginBottom: 20 }}>About Ram Dental Clinic</h2>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.9, marginBottom: 20, fontFamily: "sans-serif" }}>
              Ram Dental Clinic has been transforming smiles in Tiruppur for over 15 years. Founded with a mission to bring world-class dental care to our community, we combine the latest technology with a warm, patient-first approach.
            </p>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.9, marginBottom: 32, fontFamily: "sans-serif" }}>
              Our clinic features digital X-rays, CBCT scanning, laser dentistry, and a fully sterile environment — giving you the confidence of safety and precision at every visit.
            </p>
            {["MDS-qualified specialist doctors", "Digital X-Ray & CBCT 3D scanning", "Strictly sterile & hygienic environment", "Over 10,000 successful treatments"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontFamily: "sans-serif", fontSize: 15, color: "#334155" }}>
                <span style={{ color: "#059669", fontWeight: 700, fontSize: 18 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f", marginBottom: 8 }}>Clinic Gallery</h2>
            <p style={{ color: "#64748b", fontFamily: "sans-serif" }}>Modern infrastructure designed for comfort and precision.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns:
  window.innerWidth < 900
    ? "1fr"
    : "repeat(4, 1fr)", gap: 16 }}>
            {[
              "photo-1629909613654-28e377c37b09",
              "photo-1609840114035-3c981b782dfe",
              "photo-1588776814546-ec7e7b2f8b94",
              "photo-1588776814546-1ffcf47267a5",
            ].map(id => (
              <div key={id} style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                <img
                  src={`https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`}
                  style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #1e3a5f, #0e6e8c)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          {[["10K+", "Happy Patients"], ["15+", "Years Experience"], ["25+", "Treatments"], ["24/7", "Emergency Support"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#fbbf24" }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif", fontSize: 14, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DOCTORS ── */}
      <section style={{ padding: "96px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1e3a5f", marginBottom: 8 }}>Meet Our Specialist</h2>
            <p style={{ color: "#64748b", fontFamily: "sans-serif" }}>Experienced dental expert dedicated to world-class patient care.</p>
          </div>
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop"
                style={{ width: "100%", height: 320, objectFit: "cover" }}
                alt="Dr. Ram"
              />
              <div style={{ padding: "28px 28px 32px", textAlign: "center" }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>Dr. Ram Kumar</h3>
                <div style={{ color: "#0e6e8c", fontFamily: "sans-serif", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>MDS – Cosmetic & Implant Specialist</div>
                <p style={{ color: "#64748b", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.7 }}>15+ years delivering painless, advanced dental treatments using modern technology. Trained in India & internationally.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
                  <StarRating />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0e6e8c", marginBottom: 12 }}>PATIENT STORIES</div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1e3a5f", marginBottom: 8 }}>What Patients Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns:
  window.innerWidth < 900
    ? "1fr"
    : "repeat(3, 1fr)", gap: 24 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 20, padding: 28, border: "1px solid #e2e8f0" }}>
                <StarRating count={r.rating} />
                <p style={{ color: "#475569", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.8, margin: "16px 0" }}>"{r.text}"</p>
                <div style={{ fontWeight: 700, color: "#1e3a5f" }}>{r.name}</div>
                <div style={{ color: "#94a3b8", fontFamily: "sans-serif", fontSize: 13 }}>{r.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* ── SMILE TRANSFORMATIONS ── */}

<section
  style={{
    padding: "100px 24px",
    background: "#ffffff",
  }}
>
  <div
    style={{
      maxWidth: "1280px",
      margin: "0 auto",
    }}
  >

    <div
      style={{
        textAlign: "center",
        marginBottom: "60px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#0e6e8c",
          marginBottom: "12px",
          fontFamily: "sans-serif",
        }}
      >
        REAL PATIENT RESULTS
      </div>

      <h2
        style={{
          fontSize: "42px",
          fontWeight: "800",
          color: "#1e3a5f",
          marginBottom: "16px",
        }}
      >
        Smile Transformations
      </h2>

      <p
        style={{
          color: "#64748b",
          fontSize: "17px",
          fontFamily: "sans-serif",
        }}
      >
        See the amazing before & after results
        from our happy patients.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
  window.innerWidth < 900
    ? "1fr"
    : "repeat(2, 1fr)",
        gap: "30px",
      }}
    >

      {(showAllTransformations
        ? transformations
        : transformations.slice(0, 4)
      ).map((item) => (

        <div
          key={item.id}
          style={{
            background: "#f8fafc",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >

          <div
            style={{
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#1e3a5f",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              {item.title}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >

              <div>
                <img
                  src={item.beforeImage}
                  alt="Before"
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />

                <p
                  style={{
                    marginTop: "10px",
                    fontWeight: "700",
                    color: "#dc2626",
                  }}
                >
                  Before
                </p>
              </div>

              <div>
                <img
                  src={item.afterImage}
                  alt="After"
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />

                <p
                  style={{
                    marginTop: "10px",
                    fontWeight: "700",
                    color: "#16a34a",
                  }}
                >
                  After
                </p>
              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <button
        onClick={() =>
          setShowAllTransformations(
            !showAllTransformations
          )
        }
        style={{
          background:
            "linear-gradient(135deg, #1e3a5f, #0e6e8c)",
          color: "#fff",
          border: "none",
          padding: "16px 34px",
          borderRadius: "14px",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        {showAllTransformations
          ? "Show Less"
          : "View More Transformations"}
      </button>
    </div>

  </div>
</section>

      {/* ── CONTACT / BOOKING ── */}
      <section id="contact" style={{ padding: "96px 24px", background: "linear-gradient(135deg, #1e3a5f 0%, #0e6e8c 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Book Your Appointment</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif", fontSize: 16 }}>Fill the form below and we'll confirm your slot within 2 hours.</p>
          </div>

          {appointmentSubmitted ? (
            <div style={{ background: "#ecfdf5", borderRadius: 24, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 56 }}>🎉</div>
              <h3 style={{ fontSize: 28, color: "#065f46", margin: "16px 0 8px" }}>Appointment Booked!</h3>
              <p style={{ color: "#047857", fontFamily: "sans-serif" }}>We'll call you shortly to confirm your appointment. Thank you for choosing Ram Dental Clinic!</p>
              <button onClick={() => setAppointmentSubmitted(false)} style={{ marginTop: 20, background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontFamily: "sans-serif" }}>Book Another</button>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 24, padding: 40 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <input placeholder="Your Name *" value={appointmentForm.name} onChange={e => setAppointmentForm({ ...appointmentForm, name: e.target.value })} style={inputStyle} />
                <input placeholder="Phone Number *" value={appointmentForm.phone} onChange={e => setAppointmentForm({ ...appointmentForm, phone: e.target.value })} style={inputStyle} />
              </div>
              <div
  style={{
    display: "grid",
    gridTemplateColumns:
      window.innerWidth < 900
        ? "1fr"
        : "1fr 1fr 1fr",
    gap: 16,
    marginBottom: 16,
  }}
>

  <input
    type="date"
    value={appointmentForm.date}
    onChange={e =>
      setAppointmentForm({
        ...appointmentForm,
        date: e.target.value
      })
    }
    style={inputStyle}
  />

  <select
    value={appointmentForm.treatment}
    onChange={e =>
      setAppointmentForm({
        ...appointmentForm,
        treatment: e.target.value
      })
    }
    style={inputStyle}
  >
    <option value="">
      Select Treatment
    </option>

    {treatments.map(t => (
      <option
        key={t.id}
        value={t.name}
      >
        {t.name}
      </option>
    ))}
  </select>

  <select
    value={appointmentForm.slot}
    onChange={e =>
      setAppointmentForm({
        ...appointmentForm,
        slot: e.target.value
      })
    }
    style={inputStyle}
  >
    <option value="">
      Select Time Slot
    </option>

    <option>10:00 AM</option>
    <option>10:30 AM</option>
    <option>11:00 AM</option>
    <option>11:30 AM</option>
    <option>4:00 PM</option>
    <option>4:30 PM</option>
    <option>5:00 PM</option>
    <option>5:30 PM</option>
  </select>

</div>
              <textarea placeholder="Any message or concern..." value={appointmentForm.message} onChange={e => setAppointmentForm({ ...appointmentForm, message: e.target.value })}
                style={{ ...inputStyle, width: "100%", height: 100, resize: "vertical", boxSizing: "border-box", marginBottom: 16 }} />
              <button onClick={handleBooking}
                style={{ width: "100%", background: "linear-gradient(135deg, #1e3a5f, #0e6e8c)", color: "#fff", border: "none", borderRadius: 12, padding: 16, fontSize: 16, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 600 }}>
                📅 Confirm Appointment
              </button>
            </div>
          )}

          {/* Contact info */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 40 }}>
            {[
  ["📍", "Address", contactDetails.address],
  ["📞", "Phone", contactDetails.phone], [
  "🕐",
  "Hours",
  `Weekdays: ${clinicTiming.weekdays}
Sunday: ${clinicTiming.sunday}
Emergency: ${clinicTiming.emergency}`
]].map(([icon, label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ color: "#7dd3fc", fontFamily: "sans-serif", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                <div style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAP ── */}
      <section style={{ background: "#fff" }}>
        <iframe
          src={contactDetails.location}
          width="100%"
          height="400"
          style={{ border: 0, display: "block" }}
          allowFullScreen=""
          loading="lazy"
          title="Ram Dental Clinic Location"
        />
      </section>

      

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0f172a", borderTop: "1px solid #1e293b", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>🦷 Ram Dental Clinic</div>
        <div style={{ color: "#64748b", fontFamily: "sans-serif", fontSize: 14, marginBottom: 16 }}>Advanced Dental Care · Tiruppur, Tamil Nadu</div>
        <div style={{ color: "#475569", fontFamily: "sans-serif", fontSize: 13 }}>© 2024 Ram Dental Clinic. All rights reserved.</div>
      </footer>

      {/* ── WHATSAPP FLOAT ── */}
      <a
  href={`https://wa.me/${contactDetails.whatsapp}?text=Hello%20Ram%20Dental%20Clinic,%20I%20would%20like%20to%20book%20an%20appointment.`}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "#25D366",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "50px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    fontFamily: "sans-serif",
    fontWeight: "600",
    fontSize: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    zIndex: 999,
    transition: "0.3s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <span style={{ fontSize: "24px" }}>💬</span>

  {window.innerWidth < 900
    ? ""
    : "Chat With Us"}
</a>

      
    </div>
  );
}

const navLink = {
  color: "#334155",
  textDecoration: "none",
  fontWeight: 500,
  cursor: "pointer",
};