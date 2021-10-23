import SearchParams from './searchParams.dto';

export default interface SearchShiftParamsDto extends SearchParams {
  semesterId?: string;
  date?: Date;
}
