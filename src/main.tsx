import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import router from "@/routes/routes.tsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                token: {
                    fontSize: 18,
                },
            }}>
            <RouterProvider router={router} />
        </ConfigProvider>
    </StrictMode>,
);
