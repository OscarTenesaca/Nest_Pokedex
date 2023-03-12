import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// import axios, { AxiosInstance } from 'axios'
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-responce.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor(@InjectModel(Pokemon.name) //nombre del modelo
  private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {

  }


  async executeSeed() {
    //borrar todo
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    // Otion 1 y 2

    // const insertPromisesArray = [];

    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];
    //   console.log({ name, no });
    //   //v1 agrega 1x1 la data
    //   // const pokemon = await this.pokemonModel.create({ name, no });

    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }))

    //   // promise add all 
    //   await Promise.all(insertPromisesArray);
    // })

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      console.log({ name, no });
      //v1 agrega 1x1 la data
      // const pokemon = await this.pokemonModel.create({ name, no });

      pokemonToInsert.push({ name, no });

      // promise add all 
      await this.pokemonModel.insertMany(pokemonToInsert);

    })
    return 'seed execute';
  }

}
