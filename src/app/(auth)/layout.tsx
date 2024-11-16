
  


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (


  
    <html lang="en">
      <body

      className=" h-full md:mt-40 mt-2 flex items-center justify-center "
       
      >
       
        {children}
       
      </body>
    </html>
   
  );
}
