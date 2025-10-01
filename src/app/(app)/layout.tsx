import { Header } from "@/components/header"

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
