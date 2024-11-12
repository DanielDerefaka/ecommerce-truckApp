import Image from "next/image";




export default function FinancialSec2() {


  return (
   <div className='w-full p-10 gap-10 md:px-[80px] flex md:flex-row flex-col'>
        <div className="w-full">
        <Image src="/trk.jpg"alt="text" width={500} height={500}/>
    </div>

    <div className="w-full">
        <p className="font-bold text-2xl">Take Control of Your Financing</p>
        <p className="font-sm  text-gray-600 mt-3">
        We help you to take control of your financing options and give you the tools you need to better manage your payments and preferences. We offer flexible financing, with seven different payment types available to fit your needs. You can even opt to automatically pay via bank debit each month to ensure that your payments are always on time. You can also access your account information via our easy-to-use customer portal, which allows you to view your payment information, update your insurance policy, change your address, and more.
        </p>
    </div>



   </div>
  )
}