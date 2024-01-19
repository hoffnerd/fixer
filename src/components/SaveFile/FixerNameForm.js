"use client"

// React/Next------------------------------------------------------------------------
import { useEffect, useState } from "react";
// Context---------------------------------------------------------------------------
// Components------------------------------------------------------------------------
import { createSaveFile } from "@/actions/saveFile";
import { Button } from "@/components/shadcn/ui/button"
import { DialogFooter } from "@/components/shadcn/ui/dialog"
import { Input } from "@/components/shadcn/ui/input"
// Styles ---------------------------------------------------------------------------
import styles from "@/styles/components/SaveFile.module.css";
// Other-----------------------------------------------------------------------------
import { isObj } from "@/util";



//______________________________________________________________________________________
// ===== Constants =====
const thoseWhoShallNotBeNamed = [
    { name:"Okada", reason:"You are not related to Wakako Okada, one of the most respected Fixers of Night City." },
    { name:"Wakako", reason:"Wakako was one of the most respected Fixers of Night City. You are not her." },
    { name:"Rouge", reason:"Rouge was the Queen of the Afterlife. You are not her.", fullMatch:true },
    { name:"V", reason:"V was a legendary Merc of Night City. You are not them.", fullMatch:true },
]



//______________________________________________________________________________________
// ===== "Pure" Functions =====

const checkFixerName = (enteredName) => {
    const cleanedName = enteredName.trim().replace(/ /g, '').toLowerCase();
    for (let i = 0; i < thoseWhoShallNotBeNamed.length; i++) {
        const { name, reason, fullMatch } = thoseWhoShallNotBeNamed[i];
        
        if(fullMatch && cleanedName === name.toLowerCase()){
            return { error:true, message:reason }
        }
        
        if((!fullMatch) && cleanedName.indexOf(name.toLowerCase()) > -1){
            return { error:true, message:reason }
        }
    }
    return { error:false }
}



//______________________________________________________________________________________
// ===== Component =====

export default function FixerNameForm({ }) {

    //______________________________________________________________________________________
    // ===== State =====
    const [fixerName, setFixerName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    

    //______________________________________________________________________________________
    // ===== Use Effects =====

    useEffect(() => {
 
        if(!submitting) return;

        if(!fixerName){
            setErrorMessage("You must name yourself!");
            setSubmitting(false);
            return;
        }

        const cleanedName = fixerName.trim().replace( /\s\s+/g, ' ' );
        if(!cleanedName){
            setErrorMessage("Did you really just try to enter all spaces?");
            setSubmitting(false);
            return;
        }
        if(cleanedName.length > 40){
            setErrorMessage("Does your name really need to be greater than 40 characters? It's a name, not a sentence.");
            setSubmitting(false);
            return;
        }

        // check if the user is trying to use someones name that already exists
        const { error, message } = checkFixerName(fixerName);
        if(error){
            setErrorMessage(message);
            setSubmitting(false);
            return;
        }

        // declare that we are subscribed and want the async function below to happen
        let isSubscribed = true;

        // create an async function that fetches the data so that this `useEffect` may call it below
        const submitName = async () => {

            // return early if an unexpected render happened so that the code below does not run twice
            if(!isSubscribed) return;

            // create our save file and take us there or wait for a response
            const response = await createSaveFile(fixerName);

            // if there is no error within the response then we assume we are getting taken to the next page,
            // therefore, we should stop any further execution of this code as we have unmounted this component.
            if(!isObj(response, ["error"])) return;

            // assume there is an error that we need to display to the user
            setErrorMessage(response.message || "Something went wrong creating your save file!");
            setSubmitting(false);
        }

        // execute the async function defined above
        submitName();

        // cancel any future `fetchData` functions
        return () => isSubscribed = false;
    }, [submitting])



    //______________________________________________________________________________________
    // ===== On Change Functions  =====

    const fixerNameOnChange = (e) => {
        if(errorMessage) setErrorMessage(null);
        setFixerName(e.target.value);
    }



    //______________________________________________________________________________________
    // ===== Component Return  =====

    return <>
        <div className="py-4">
            <Input id="name" className="col-span-4" placeholder="Wakako Okada" value={fixerName} onChange={(e)=>fixerNameOnChange(e)} />
            {errorMessage && <p className="pt-4 text-sm neonText neonTextGlow red">{errorMessage}</p>}
        </div>
        <DialogFooter>
            <Button variant="neonWhiteWithGlow" type="submit" onClick={()=>setSubmitting(true)} disabled={submitting}>
                {submitting ? "...Starting Game..." : "Start Game"}
            </Button>
        </DialogFooter>
    </>
}
