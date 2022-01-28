export type CapturedImageType={
    height:number
    uri:string
    width:number
    cancelled?:boolean
    type?:string
}

export type CameraType=number | "front" | "back" | undefined
export type FlashModeType= number | "on" | "off" | "auto" | "torch" | undefined


export type EachCategoryType={
    label:string 
    id:string
}