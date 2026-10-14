import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Dish } from './entities/dish.entity.js';
import { CreateDishDto } from './dto/create-dish.dto.js';
import { UpdateDishDto } from './dto/update-dish.dto.js';

@Injectable()
export class DishesService {
  private items: Dish[] = [
    {
      id: '1',
      title: 'Український борщ із пампушками',
      price: 195,
      weightGrams: 400,
      calories: 380,
      isSpicy: false,
    },
    {
      id: '2',
      title: 'Піца Діавола з перцем халапеньйо',
      price: 290,
      weightGrams: 480,
      calories: 820,
      isSpicy: true,
    },
    {
      id: '3',
      title: 'Том Ям з королівськими креветками',
      price: 340,
      weightGrams: 360,
      calories: 310,
      isSpicy: true,
    },
  ];

  findAll(query?: {
    search?: string;
    isSpicy?: boolean;
    maxPrice?: number;
  }): Dish[] {
    let result = [...this.items];

    if (query?.search) {
      const searchLower = query.search.toLowerCase().trim();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchLower),
      );
    }

    if (query?.isSpicy !== undefined) {
      result = result.filter((item) => item.isSpicy === query.isSpicy);
    }

    if (query?.maxPrice !== undefined && !Number.isNaN(query.maxPrice)) {
      result = result.filter((item) => item.price <= query.maxPrice!);
    }

    return result;
  }

  findOne(id: string): Dish {
    const dish = this.items.find((item) => item.id === id);
    if (!dish) {
      throw new NotFoundException(`Сутність з ID ${id} не знайдена`);
    }
    return dish;
  }

  create(dto: CreateDishDto): Dish {
    const newDish = new Dish();
    newDish.id = randomUUID();
    newDish.title = dto.title;
    newDish.price = Number(dto.price);
    newDish.weightGrams = Number(dto.weightGrams);
    newDish.calories = Number(dto.calories);
    newDish.isSpicy = Boolean(dto.isSpicy);

    this.items.push(newDish);
    return newDish;
  }

  update(id: string, dto: UpdateDishDto): Dish {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Сутність з ID ${id} не знайдена`);
    }

    const current = this.items[index];
    const updatedDish = new Dish();
    updatedDish.id = current.id;
    updatedDish.title = dto.title !== undefined ? dto.title : current.title;
    updatedDish.price =
      dto.price !== undefined ? Number(dto.price) : current.price;
    updatedDish.weightGrams =
      dto.weightGrams !== undefined
        ? Number(dto.weightGrams)
        : current.weightGrams;
    updatedDish.calories =
      dto.calories !== undefined ? Number(dto.calories) : current.calories;
    updatedDish.isSpicy =
      dto.isSpicy !== undefined
        ? typeof dto.isSpicy === 'string'
          ? dto.isSpicy === 'true'
          : Boolean(dto.isSpicy)
        : current.isSpicy;

    this.items[index] = updatedDish;
    return updatedDish;
  }

  remove(id: string): void {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Сутність з ID ${id} не знайдена`);
    }
    this.items.splice(index, 1);
  }
}
