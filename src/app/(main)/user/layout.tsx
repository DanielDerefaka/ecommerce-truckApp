import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


type Props = {
  children: React.ReactNode;

};

const layout = async ({ children }: Props) => {

  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }
 
  return (
    <div className="">
     
       {children}
   
    </div>
  );
};

export default layout;