import React, { useState } from 'react';

const CostCalculator = ({ pricePerNight, weeklyDiscount, cleaningFee, serviceFee, occupancyTaxes }) => {
    const [nights, setNights] = useState(1);
    const [guests, setGuests] = useState(1); //Required for dynamic updates 

    //Cost logic
    const basePrice = pricePerNight * nights;
    const discountAmount = nights >= 7 ? basePrice * (weeklyDiscount / 100) : 0;
    const totalBeforeTaxes = (basePrice - discountAmount) + cleaningFee + serviceFee;
    const total = totalBeforeTaxes + occupancyTaxes;

    return (
        <div className="calculator-card">
            <h3>R{pricePerNight} / night</h3>
            <div>
                <label>Nights: </label>
                <input type="number" min="1" value={nights} onChange={(e) => setNights(e.target.value)} />
            </div>
            <div>
                <p>Base Price ({nights} nights): R{basePrice}</p>
                {nights >= 7 && <p>Weekly Discount: -R{discountAmount}</p>}
                <p>Cleaning Fee: R{cleaningFee}</p>
                <p>Service Fee: R{serviceFee}</p>
                <p>Occupancy Taxes: R{occupancyTaxes}</p>
                <h4>Total: R{total}</h4>
                
                {/* Reservation button to create a reservation in MongoDB */}
                <button onClick={() => alert('Proceed to book!')}>Reserve</button> 
            </div>
        </div>
    );
};

export default CostCalculator;