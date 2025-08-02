import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProfile from "./Routes/getProfile";
import axios from "axios";

const SuccessPayment = () => {
  const params = useParams(); 
   const [transaction, setTransaction] = useState(null);
  const profile=useProfile()
  
  const { trxid} = params;
  console.log(profile, params, trxid)
  useEffect(() => {
  axios.get(`https://club-event-management-server.onrender.com/payments/${profile.email}/${trxid}`)
      .then(res => {setTransaction(res.data)});
  }, [trxid]);

  if (!transaction) {
    return <div className="text-center mt-10 text-xl">Loading transaction details...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-green-100 p-6 rounded-xl shadow-md border border-green-300">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h2>
      <p className="mb-2"><strong>Transaction ID:</strong> {transaction?.trxId}</p>
      <p className="mb-2"><strong>Amount Paid:</strong> ৳{transaction.paymentAmount}</p>
      <p className="mb-2"><strong>Email:</strong> {transaction.userEmail}</p>
      <p className="mb-2"><strong>Card Type:</strong> {transaction.card_type}</p>
      <p className="mb-2"><strong>Bank Transaction ID:</strong> {transaction.bank_tran_id}</p>
      <p className="mb-2"><strong>Payment Date:</strong> {new Date(transaction.tran_date).toLocaleString()}</p>

      <div className="mt-6 p-4 bg-white border border-green-400 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold text-green-600">You are now enrolled in the event! 🎊</h3>
        <p className="text-sm text-gray-700 mt-1">Check your dashboard for event details.</p>
      </div>
    </div>
  );
};

export default SuccessPayment;
