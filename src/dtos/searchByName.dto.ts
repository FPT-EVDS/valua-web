import SearchParams from './searchParams.dto';

export default interface SearchByNameDto extends SearchParams {
  search?: string;
}
