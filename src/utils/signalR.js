import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

// Tạo một module hoặc đối tượng để chứa các hàm liên quan đến SignalR
const SignalRHelper = (function () {

    var connection;

    function initializeConnection() {
        connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5030/hub/device-data") // Thay thế bằng địa chỉ hub của bạn
            .build();

        // Điều khiển sự kiện kết nối
        connection.on("connected", function () {
            console.log("Connected to SignalR hub");
        });

        // Điều khiển sự kiện nhận message
        connection.on("receiveMessage", function (message) {
            console.log("Received message:", message);
        });

        // Bắt đầu kết nối
        connection.start()
            .then(function () {
                console.log("Connection started");
            })
            .catch(function (err) {
                console.error("Error starting connection:", err);
            });
    }

    // Gửi message đến hub
    function sendMessage(message) {
        if (connection && connection.state === HubConnectionState.Connected) {
            connection.invoke("sendMessage", message)
                .catch(function (err) {
                    console.error("Error sending message:", err);
                });
        } else {
            console.warn("Connection is not established or in a valid state.");
        }
    }

    // Xuất các hàm hoặc đối tượng cần thiết
    return {
        initializeConnection: initializeConnection,
        sendMessage: sendMessage
    };
})();

export default SignalRHelper;