import { wishlist } from './../../node_modules/.prisma/client/index.d';
import { NextApiRequest , NextApiResponse } from 'next'
import {prisma} from '../../lib/prisma'
import axios, { AxiosResponse } from 'axios'



export default async function getUserDetails(req: NextApiRequest , res: NextApiResponse){

    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id :req.user.user.id
        },
        include: {
            wishlist: true,
            cart: true
        }
    })


    if(user){
    
        const wishlistMovies: any = await Promise.all(user.wishlist!.moviesIDs.map(async (id) => await getMovie(id)))
        const cartMovies: any = await Promise.all(user.cart!.movieIDs.map(async (id) => await getMovie(id)))
        res.json({wishlist: wishlistMovies,cart: cartMovies, user})


    }else{
        res.status(404).json({"Something wrong happened"!})
    }

   

}

const getMovie = async (id: string) => {
    const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    return data
}

