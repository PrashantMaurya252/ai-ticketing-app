import { NonRetriableError } from "inngest";
import User from "../../models/user.js";
import { inngest } from "../client.js";

export const onUserSignUp = inngest.createFunction(
    {id:"on-user-signup",retries:2},
    {event:"user/signup"},
    async({event,step})=>{
        try {
            const {email} = event.data
            await step.run("get-user-email",async()=>{
                const user = await User.findOne({email})

                if(!user){
                    throw new NonRetriableError("User no longer exist in our database")
                }

            })
        } catch (error) {
            
        }
    }
)