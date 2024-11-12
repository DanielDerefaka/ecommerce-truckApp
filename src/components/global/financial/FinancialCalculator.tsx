import Image from "next/image";




export default function FinancingCalculator() {


  return (
   <div className='w-full p-10 gap-10 md:px-[80px] flex md:flex-row flex-col'>
    <div className="w-full">
        <p className="font-bold text-2xl">How it Works</p>
        <p className="font-sm text-gray-600 mt-3">
        We are proud to have the easiest financing application in the industry! Our criteria is different than most, which makes our process more flexible and gets you in a truck faster. We provide financing for hundreds of truck purchases every month. Used semi-truck financing is all we do, and we fully understand the needs of owner-operators. We custom tailor financing packages and payment schedules to meet your needs and budget requirements to ensure your purchase remains a smart investment. Provide just a few quick details on our Pre-Qualification form to see what you can expect regarding your ability to finance a truck through Arrow Financial Services or complete and submit our secure Credit Application.
        </p>
    </div>

    <div className="w-full">
        <Image src="/tru.webp"alt="text" width={500} height={500}/>
    </div>

   </div>
  )
}