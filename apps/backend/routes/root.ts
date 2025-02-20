import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const tags = ["Root"];

export const rootRoute = new OpenAPIHono();

rootRoute.openapi(
    createRoute({
        method: 'get',
        path:'/hello',
        tags,
        request:{
            query: z.object({
                name: z.string().optional(),
            })
        },
        responses:{
            200: {
                description: "Response Hello World",
                content:{
                    "application/json":{
                        schema: z.object({
                            message: z.string(),
                        })
                    }
                }
            }
        }
    }),
    (context) =>{
        const { name } = context.req.valid("query");
        if(!name){
            return context.json({
               message: "Hello There are No Name"
            })
        } 
        return context.json({
            message: `Hello ${name}`
        })
    }
)