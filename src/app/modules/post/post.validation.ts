import { array, boolean, string, z } from "zod";

const CreatePostValidationSchema = z.object({
    title:string().nonempty(),
    content:string().nonempty(),
    category:string().nonempty(),
    thumbnail:string().url(),
    tags:array(string()).optional(),
    is_premium:boolean().optional()
})



export const PostValidations = {
    CreatePostValidationSchema
}