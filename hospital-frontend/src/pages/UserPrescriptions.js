// src/pages/UserPrescriptions.js
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { jwtDecode } from 'jwt-decode';
import { FaFilePdf, FaPrint, FaUserMd, FaUserInjured, FaPills } from 'react-icons/fa';
import { MdMedicalServices, MdNotes, MdAttachMoney } from 'react-icons/md';
// import './UserPrescriptions.css';

const UserPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const prescriptionRefs = useRef({});

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded.userId;

        const res = await axios.get(`http://localhost:5000/api/prescriptions/byUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPrescriptions(res.data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const generatePDF = async (id) => {
    const element = prescriptionRefs.current[id];
    const canvas = await html2canvas(element, { scale: 2, logging: false, useCORS: true, allowTaint: true });
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    pdf.setFontSize(40);
    pdf.setTextColor(200, 200, 200);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Valid Prescription', 105, 150, { angle: 45, align: 'center' });
    pdf.save(`Prescription_${new Date().toISOString().split('T')[0]}_${id.slice(-6)}.pdf`);
  };

  const printPrescription = async (id) => {
    const element = prescriptionRefs.current[id];
    const canvas = await html2canvas(element, { scale: 2 });
    const dataUrl = canvas.toDataURL();

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Prescription</title>
          <link rel="stylesheet" href="UserPrescriptions.css" />
        </head>
        <body>
          <img src="${dataUrl}" />
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="no-data">
        <div className="no-data-icon">📄</div>
        <h2>No Prescriptions Found</h2>
        <p>You don't have any prescriptions yet.</p>
      </div>
    );
  }

  return (
    <div className="user-prescription-container">
      <h2 className="title">My Prescriptions</h2>
      <div className="grid">
        {prescriptions.map(p => (
  <div key={p._id} ref={el => (prescriptionRefs.current[p._id] = el)} className="card">
    <div className="card-header">
      <h3>MEDICAL PRESCRIPTION</h3>
      <div className="date">
        {new Date(p.createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}
      </div>
    </div>

    <div className="info">
      <div className="info-block">
        <FaUserMd className="icon" />
        <div>
          <h4>Hospital</h4>
          <p>TeleMedicine Hospital</p>
        </div>
      </div>
      <div className="info-block">
        <FaUserInjured className="icon" />
        <div>
          <h4>Patient</h4>
          <p>{p.patientId?.name || 'Unknown Patient'}</p>
        </div>
      </div>
    </div>

    <div className="medicines">
      <div className="section-title">
        <FaPills className="icon" /><h4>Medications</h4>
      </div>
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Instructions</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {p.medicines.map((m, i) => (
            <tr key={i}>
              <td>{m.name}</td>
              <td>{m.count} × {m.days} days</td>
              <td>{m.time}, {m.foodTime}{m.syrupML && `, ${m.syrupML}`}</td>
              <td>₹{m.price}</td>
              <td>₹{m.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="extras">
      {p.tests?.length > 0 && (
        <div className="test-section">
          <MdMedicalServices className="icon" />
          <h4>Recommended Tests</h4>
          <p>{p.tests.join(', ')}</p>
        </div>
      )}
      {p.notes && (
        <div className="note-section">
          <MdNotes className="icon" />
          <h4>Doctor's Notes</h4>
          <p>{p.notes}</p>
        </div>
      )}
      <div className="summary-section">
        <p><strong>Total Medicines:</strong> {p.totalMedicines}</p>
        <p><strong>Total Items:</strong> {p.totalItems}</p>
        <p className="price"><MdAttachMoney className="icon" /> <strong>Total Bill:</strong> ₹{p.billAmount}</p>
      </div>

      <div className="prescriptionfooter">
        <div className="buttons">
          <button onClick={() => generatePDF(p._id)}><FaFilePdf /> PDF</button>
          <button onClick={() => printPrescription(p._id)}><FaPrint /> Print</button>
        </div>
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default UserPrescriptions;



// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { jwtDecode } from 'jwt-decode';
// import { FaFilePdf, FaPrint, FaUserMd, FaUserInjured, FaCalendarAlt, FaPills } from 'react-icons/fa';
// import { MdMedicalServices, MdNotes, MdAttachMoney } from 'react-icons/md';

// const UserPrescriptions = () => {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const prescriptionRefs = useRef({});

//   useEffect(() => {
//     const fetchPrescriptions = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const decoded = jwtDecode(token);
//         const userId = decoded.id || decoded.userId;

//         const res = await axios.get(`http://localhost:5000/api/prescriptions/byUser/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setPrescriptions(res.data);
//       } catch (err) {
//         console.error('Error fetching prescriptions:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrescriptions();
//   }, []);

//   const generatePDF = async (id) => {
//     const element = prescriptionRefs.current[id];
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       logging: false,
//       useCORS: true,
//       allowTaint: true
//     });

//     const imgData = canvas.toDataURL('image/png', 1.0);
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    
//     // Add watermark
//     pdf.setFontSize(40);
//     pdf.setTextColor(200, 200, 200);
//     pdf.setFont('helvetica', 'italic');
//     pdf.text('Valid Prescription', 105, 150, { angle: 45, align: 'center' });
    
//     pdf.save(`Prescription_${new Date().toISOString().split('T')[0]}_${id.slice(-6)}.pdf`);
//   };

//   const printPrescription = async (id) => {
//     const element = prescriptionRefs.current[id];
//     const canvas = await html2canvas(element, { scale: 2 });
//     const dataUrl = canvas.toDataURL();
    
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Print Prescription</title>
//           <style>
//             body { margin: 0; padding: 0; }
//             img { max-width: 100%; height: auto; }
//           </style>
//         </head>
//         <body>
//           <img src="${dataUrl}" />
//           <script>
//             window.onload = function() {
//               setTimeout(function() {
//                 window.print();
//                 window.close();
//               }, 500);
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (prescriptions.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center p-8">
//         <div className="text-gray-500 text-5xl mb-4">📄</div>
//         <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Prescriptions Found</h2>
//         <p className="text-gray-500">You don't have any prescriptions yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">My Prescriptions</h2>
      
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {prescriptions.map(p => (
//           <div
//             key={p._id}
//             ref={el => (prescriptionRefs.current[p._id] = el)}
//             className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
//           >
//             {/* Prescription Header */}
//             <div className="bg-blue-600 text-white p-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold">MEDICAL PRESCRIPTION</h3>
//                 <span className="text-sm bg-white text-blue-600 px-2 py-1 rounded">
//                   #{p._id.slice(-6).toUpperCase()}
//                 </span>
//               </div>
//               <div className="text-sm mt-1">{new Date(p.createdAt).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}</div>
//             </div>

//             {/* Doctor & Patient Info */}
//             <div className="p-4 border-b">
//               <div className="flex items-center mb-3">
//                 <FaUserMd className="text-blue-500 mr-2" />
//                 <div>
//                   <h4 className="font-semibold text-gray-700">Doctor</h4>
//                   <p className="text-gray-600">{p.doctorId?.name || 'Dr. Unknown'}</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <FaUserInjured className="text-blue-500 mr-2" />
//                 <div>
//                   <h4 className="font-semibold text-gray-700">Patient</h4>
//                   <p className="text-gray-600">{p.patientId?.name || 'Unknown Patient'}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Medicines */}
//             <div className="p-4 border-b">
//               <div className="flex items-center mb-2">
//                 <FaPills className="text-blue-500 mr-2" />
//                 <h4 className="font-semibold text-gray-700">Medications</h4>
//               </div>
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="text-left py-2 px-2">Medicine</th>
//                     <th className="text-left py-2 px-2">Dosage</th>
//                     <th className="text-left py-2 px-2">Instructions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {p.medicines.map((m, i) => (
//                     <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="py-2 px-2 font-medium">{m.name}</td>
//                       <td className="py-2 px-2">
//                         {m.count} {m.count > 1 ? 'tablets' : 'tablet'} × {m.days} days
//                       </td>
//                       <td className="py-2 px-2">
//                         {m.time}, {m.foodTime}
//                         {m.syrupML && `, ${m.syrupML}`}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Additional Information */}
//             <div className="p-4">
//               {p.tests?.length > 0 && (
//                 <div className="mb-3">
//                   <div className="flex items-center mb-1">
//                     <MdMedicalServices className="text-blue-500 mr-2" />
//                     <h4 className="font-semibold text-gray-700">Recommended Tests</h4>
//                   </div>
//                   <p className="text-gray-600">{p.tests.join(', ')}</p>
//                 </div>
//               )}

//               {p.notes && (
//                 <div className="mb-3">
//                   <div className="flex items-center mb-1">
//                     <MdNotes className="text-blue-500 mr-2" />
//                     <h4 className="font-semibold text-gray-700">Doctor's Notes</h4>
//                   </div>
//                   <p className="text-gray-600">{p.notes}</p>
//                 </div>
//               )}

//               <div className="flex justify-between items-center mt-4 pt-3 border-t">
//                 <div className="flex items-center">
//                   <MdAttachMoney className="text-blue-500 mr-2" />
//                   <span className="font-semibold">Total: ₹{p.billAmount}</span>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => generatePDF(p._id)}
//                     className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     <FaFilePdf className="mr-1" /> PDF
//                   </button>
//                   <button
//                     onClick={() => printPrescription(p._id)}
//                     className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     <FaPrint className="mr-1" /> Print
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserPrescriptions;