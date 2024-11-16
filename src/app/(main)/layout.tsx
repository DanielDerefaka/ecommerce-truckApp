import Footer from "@/components/global/site/Footer";
import Navbar from "@/components/global/site/Navbar";
import TopBar from "@/components/global/site/TopBar"; 

  


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
  
  
    
      <html lang="en">
        <body
  
        className="   "
         
        >
         
         <TopBar/>
        <Navbar/>
        {children}
        <Footer/>
         
        </body>
      </html>
     
    );
  }
  