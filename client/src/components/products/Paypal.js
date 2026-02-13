import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect } from "react";

// Cấu hình cố định: currency (tiền tệ) và amount (số tiền)
const style = { "layout": "vertical" };

const ButtonWrapper = ({ currency, showSpinner, amount, payload, handleSaveOrder }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);

    return (
        <>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[amount, currency, style]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: amount,
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            return orderId;
                        });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(async (response) => {
                        if (response.status === 'COMPLETED') {
                            // Gọi hàm lưu đơn hàng vào DB sau khi thanh toán thành công
                            handleSaveOrder();
                        }
                    });
                }}
            />
        </>
    );
}

export default function Paypal({ amount, payload, handleSaveOrder }) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider
                options={{
                    "client-id": "YOUR_CLIENT_ID_HERE", // Lấy từ trang developer.paypal.com
                    components: "buttons",
                    currency: "USD" // PayPal ở VN chủ yếu dùng USD, bạn nên quy đổi VND sang USD
                }}
            >
                <ButtonWrapper 
                    currency={'USD'} 
                    amount={amount} 
                    showSpinner={false} 
                    payload={payload}
                    handleSaveOrder={handleSaveOrder}
                />
            </PayPalScriptProvider>
        </div>
    );
}