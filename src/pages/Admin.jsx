import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { db, auth } from "../firebase";
export default function Admin() {

  const [appointments, setAppointments] = useState([]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
    loggedIn: false,
    error: "",
  });

  const [treatments, setTreatments] = useState([]);

  const [newTreatment, setNewTreatment] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

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
  const [transformations, setTransformations] = useState([]);

const [newTransformation, setNewTransformation] = useState({
  title: "",
  beforeImage: "",
  afterImage: "",
});

  const handleLogin = async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password
    );

    let role = "nurse";

    if (loginData.email === "doctor@gmail.com") {
      role = "doctor";
    }

    setLoginData({
      ...loginData,
      loggedIn: true,
      role: role,
      error: "",
    });

  } catch (error) {

    setLoginData({
      ...loginData,
      error: "Invalid email or password",
    });

  }

};

  useEffect(() => {

  fetchAppointments();

  fetchTreatments();

  fetchTransformations();

  onAuthStateChanged(auth, (user) => {

    if (user) {

      let role = "nurse";

      if (user.email === "doctor@gmail.com") {
        role = "doctor";
      }

      setLoginData((prev) => ({
        ...prev,
        loggedIn: true,
        role: role,
        email: user.email,
      }));

    }

  });

}, []);
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

const addTransformation = async () => {

  if (
    !newTransformation.title ||
    !newTransformation.beforeImage ||
    !newTransformation.afterImage
  ) {
    alert("Please fill all fields");
    return;
  }

  await addDoc(
    collection(db, "transformations"),
    newTransformation
  );

  setNewTransformation({
    title: "",
    beforeImage: "",
    afterImage: "",
  });

  fetchTransformations();

  alert("Transformation added!");
};

const deleteTransformation = async (id) => {

  await deleteDoc(
    doc(db, "transformations", id)
  );

  fetchTransformations();

  alert("Transformation deleted!");
};

  const fetchAppointments = async () => {

    const querySnapshot = await getDocs(
      collection(db, "appointments")
    );

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAppointments(data);
  };

  const fetchTreatments = async () => {

    const querySnapshot = await getDocs(
      collection(db, "treatments")
    );

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTreatments(data);
  };

  const addTreatment = async () => {

    if (
      !newTreatment.name ||
      !newTreatment.description ||
      !newTreatment.price ||
      !newTreatment.image
    ) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(
      collection(db, "treatments"),
      newTreatment
    );

    setNewTreatment({
      name: "",
      description: "",
      price: "",
      image: "",
    });

    fetchTreatments();

    alert("Treatment added!");
  };

  const deleteTreatment = async (id) => {

    await deleteDoc(doc(db, "treatments", id));

    fetchTreatments();

    alert("Treatment deleted!");
  };

  const editTreatment = async (treatment) => {

    const newName = prompt(
      "Enter new treatment name",
      treatment.name
    );

    const newDescription = prompt(
      "Enter new description",
      treatment.description
    );

    const newPrice = prompt(
      "Enter new price",
      treatment.price
    );

    const newImage = prompt(
      "Enter new image URL",
      treatment.image
    );

    if (
      !newName ||
      !newDescription ||
      !newPrice ||
      !newImage
    ) {
      return;
    }

    await updateDoc(
      doc(db, "treatments", treatment.id),
      {
        name: newName,
        description: newDescription,
        price: newPrice,
        image: newImage,
      }
    );

    fetchTreatments();

    alert("Treatment updated!");
  };

  const updateAppointmentStatus = async (
    id,
    status
  ) => {

    await updateDoc(
      doc(db, "appointments", id),
      {
        status: status,
      }
    );

    fetchAppointments();

    alert(`Appointment ${status}`);
  };

  const saveClinicTiming = async () => {

    await setDoc(
      doc(db, "settings", "clinicTiming"),
      clinicTiming
    );

    alert("Clinic timing updated!");
  };

  const saveContactDetails = async () => {

    await setDoc(
      doc(db, "settings", "contactDetails"),
      contactDetails
    );

    alert("Contact details updated!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#081b3a",
        color: "white",
        padding: "40px",
      }}
    >

      {!loginData.loggedIn ? (

        <div
  style={{
    width: "100%",
    maxWidth: "460px",
    margin: "80px auto",
    background: "rgba(15, 23, 42, 0.95)",
    padding: "50px 40px",
    borderRadius: "28px",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
  }}
>

          <h1
  style={{
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "52px",
    fontWeight: "800",
    letterSpacing: "-2px",
    color: "#ffffff",
    lineHeight: 1.1,
  }}
>
  Clinic Admin
</h1>
<p
  style={{
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "35px",
    fontSize: "16px",
  }}
>
  Secure dashboard access
</p>

          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              
              setLoginData({
                ...loginData,
                email: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value,
              })
            }
            style={inputStyle}
          />

          {loginData.error && (
            <p style={{ color: "red" }}>
              {loginData.error}
            </p>
          )}

          <button
            onClick={handleLogin}
            style={buttonStyle}
          >
            Login
          </button>

          <div
            style={{
              marginTop: "20px",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Doctor:
            doctor@ram.com / ram123
            <br />
            Nurse:
            nurse@ram.com / nurse123
          </div>

        </div>

      ) : (

        <div>

          <h1
            style={{
              fontSize: "40px",
              marginBottom: "30px",
            }}
          >
            {loginData.role === "doctor"
              ? "Doctor Dashboard"
              : "Nurse Dashboard"}
          </h1>
          <button
  onClick={async () => {

  await signOut(auth);

  setLoginData({
    email: "",
    password: "",
    role: "",
    loggedIn: false,
    error: "",
  });

}}
  style={{
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "30px",
  }}
>
  Logout
</button>

          {/* APPOINTMENTS */}

          <h2 style={{ marginBottom: "20px" }}>
            Appointments
          </h2>

          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            appointments.map((appt) => (

              <div
                key={appt.id}
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  padding: "24px",
                  borderRadius: "18px",
                  marginBottom: "20px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "20px",
                  alignItems: "center",
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.08)",
                  border: "1px solid #e2e8f0",
                }}
              >

                <div>

                  <h2
                    style={{
                      fontSize: "24px",
                      marginBottom: "12px",
                      color: "#0f172a",
                      fontWeight: "700",
                    }}
                  >
                    {appt.patient}
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "10px",
                      color: "#334155",
                    }}
                  >

                    <div>
                      <strong>Phone:</strong>
                      {" "}
                      {appt.phone}
                    </div>

                    <div>
                      <strong>Treatment:</strong>
                      {" "}
                      {appt.treatment}
                    </div>

                    <div>
                      <strong>Date:</strong>
                      {" "}
                      {appt.date}
                    </div>

                    <div>
                      <strong>Status:</strong>

                      <span
                        style={{
                          marginLeft: "8px",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          background:
                            appt.status === "Approved"
                              ? "#16a34a"
                              : appt.status ===
                                "Rejected"
                              ? "#dc2626"
                              : "#f59e0b",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {appt.status}
                      </span>
                    </div>

                  </div>

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >

                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        appt.id,
                        "Approved"
                      )
                    }
                    style={{
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        appt.id,
                        "Rejected"
                      )
                    }
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>

                </div>

              </div>

            ))
          )}

          {loginData.role === "doctor" && (

            <>

              {/* ADD TREATMENT */}

              <div
                style={{
                  background: "#0f172a",
                  padding: "25px",
                  borderRadius: "16px",
                  marginTop: "50px",
                }}
              >

                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Add Treatment
                </h2>

                <input
                  type="text"
                  placeholder="Treatment Name"
                  value={newTreatment.name}
                  onChange={(e) =>
                    setNewTreatment({
                      ...newTreatment,
                      name: e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <textarea
                  placeholder="Description"
                  value={newTreatment.description}
                  onChange={(e) =>
                    setNewTreatment({
                      ...newTreatment,
                      description:
                        e.target.value,
                    })
                  }
                  style={{
                    ...inputStyle,
                    height: "100px",
                  }}
                />

                <input
                  type="text"
                  placeholder="Price"
                  value={newTreatment.price}
                  onChange={(e) =>
                    setNewTreatment({
                      ...newTreatment,
                      price: e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={newTreatment.image}
                  onChange={(e) =>
                    setNewTreatment({
                      ...newTreatment,
                      image: e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <button
                  onClick={addTreatment}
                  style={buttonStyle}
                >
                  Add Treatment
                </button>

              </div>

              {/* MANAGE TREATMENTS */}

              <div style={{ marginTop: "50px" }}>

                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Manage Treatments
                </h2>

                {treatments.map((t) => (

                  <div
                    key={t.id}
                    style={{
                      background: "#0f172a",
                      padding: "20px",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                      }}
                    >

                      <img
                        src={t.image}
                        alt={t.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />

                      <div>
                        <h3>{t.name}</h3>
                        <p>{t.price}</p>
                      </div>

                    </div>

                    <div>

                      {loginData.role === "doctor" && (
  <>
    <button
      onClick={() =>
        editTreatment(t)
      }
      style={{
        background: "#0284c7",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        marginRight: "10px",
      }}
    >
      Edit
    </button>

    <button
      onClick={() =>
        deleteTreatment(t.id)
      }
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  </>
)}

                    </div>

                  </div>

                ))}

              </div>
              {/* SMILE TRANSFORMATIONS */}

<div
  style={{
    background: "#0f172a",
    padding: "25px",
    borderRadius: "16px",
    marginTop: "50px",
  }}
>

  <h2
    style={{
      marginBottom: "20px",
    }}
  >
    Smile Transformations
  </h2>

  <input
    type="text"
    placeholder="Transformation Title"
    value={newTransformation.title}
    onChange={(e) =>
      setNewTransformation({
        ...newTransformation,
        title: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    type="text"
    placeholder="Before Image URL"
    value={newTransformation.beforeImage}
    onChange={(e) =>
      setNewTransformation({
        ...newTransformation,
        beforeImage: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    type="text"
    placeholder="After Image URL"
    value={newTransformation.afterImage}
    onChange={(e) =>
      setNewTransformation({
        ...newTransformation,
        afterImage: e.target.value,
      })
    }
    style={inputStyle}
  />

  <button
    onClick={addTransformation}
    style={buttonStyle}
  >
    Add Transformation
  </button>

  <div style={{ marginTop: "30px" }}>

    {transformations.map((item) => (

      <div
        key={item.id}
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "14px",
          marginBottom: "20px",
        }}
      >

        <h3 style={{ marginBottom: "15px" }}>
          {item.title}
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >

          <img
            src={item.beforeImage}
            alt="Before"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />

          <img
            src={item.afterImage}
            alt="After"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />

        </div>

        <button
          onClick={() =>
            deleteTransformation(item.id)
          }
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Delete Transformation
        </button>

      </div>

    ))}

  </div>

</div>

              {/* CLINIC TIMING */}

              <div
                style={{
                  background: "#0f172a",
                  padding: "25px",
                  borderRadius: "16px",
                  marginTop: "50px",
                }}
              >

                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Clinic Timing Settings
                </h2>

                <input
                  type="text"
                  placeholder="Weekday Timing"
                  value={clinicTiming.weekdays}
                  onChange={(e) =>
                    setClinicTiming({
                      ...clinicTiming,
                      weekdays:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Sunday Timing"
                  value={clinicTiming.sunday}
                  onChange={(e) =>
                    setClinicTiming({
                      ...clinicTiming,
                      sunday:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Emergency Availability"
                  value={clinicTiming.emergency}
                  onChange={(e) =>
                    setClinicTiming({
                      ...clinicTiming,
                      emergency:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <button
                  onClick={saveClinicTiming}
                  style={buttonStyle}
                >
                  Save Timing
                </button>

              </div>

              {/* CONTACT DETAILS */}

              <div
                style={{
                  background: "#0f172a",
                  padding: "25px",
                  borderRadius: "16px",
                  marginTop: "50px",
                }}
              >

                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  Contact Details Settings
                </h2>

                <input
                  type="text"
                  placeholder="Clinic Address"
                  value={contactDetails.address}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      address:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={contactDetails.phone}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      phone:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={contactDetails.whatsapp}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      whatsapp:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactDetails.email}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      email:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Google Maps Location Link"
                  value={contactDetails.location}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      location:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />

                <button
                  onClick={saveContactDetails}
                  style={buttonStyle}
                >
                  Save Contact Details
                </button>

              </div>

            </>

          )}

        </div>

      )}

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
  color: "white",
  border: "none",
  padding: "15px",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "700",
  marginTop: "10px",
};