import React from 'react'

function AdBanner() {
    return (
        <div className="w-64 bg-blue-200 p-4 fixed bottom-4 right-4 shadow-lg">
            <img
                src="https://via.placeholder.com/200x300?text=Quảng+Cáo+VNPAY"
                alt="Ad Banner"
                className="w-full h-auto"
            />
        </div>
    )
}

export default AdBanner