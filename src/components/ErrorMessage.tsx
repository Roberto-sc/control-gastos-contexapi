import { PropsWithChildren } from "react"


export default function ErrorMessage({children}: PropsWithChildren) {
  return (
    <p className=" text-white font-bold p-2 text-sm text-center bg-red-600">
        {children}
    </p>
  )
}
