

export interface LandingPage {
    id:     number;
    title:  string;
    movies: Movie[];
}

export type Movie = {
    adult:                 boolean;
    backdrop_path:         string;
    belongs_to_collection: BelongsToCollection;
    budget:                number;
    genres:                Genre[];
    homepage:              string;
    id:                    number;
    imdb_id:               string;
    original_language:     string;
    original_title:        string;
    overview:              string;
    popularity:            number;
    poster_path:           string;
    production_companies:  ProductionCompany[];
    production_countries:  ProductionCountry[];
    release_date:          Date;
    revenue:               number;
    runtime:               number;
    spoken_languages:      SpokenLanguage[];
    status:                string;
    tagline:               string;
    title:                 string;
    video:                 boolean;
    vote_average:          number;
    vote_count:            number;
    isPurchased:           boolean;
    inCart:                boolean;
    inWishlist:            boolean;
    price:                 number;
}


export type AuthorizedUser {
    id: string
}

export interface User {
    userName: string;
    email:    string;
    balance:  number;
}

export type Genre = {
    id:   number;
    name: string;
}

interface MutationErrorResponse{
    response: any;
    data: {
        message : string
    }
        
}
