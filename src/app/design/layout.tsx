import { M_PLUS_Rounded_1c } from "next/font/google";

import "./design.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-mplus-rounded",
  display: "swap",
});

export default function DesignRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`design-app ${mPlusRounded.variable}`}>{children}</div>
  );
}
