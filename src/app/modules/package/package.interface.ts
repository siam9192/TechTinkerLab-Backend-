export type TPackageService = {
  name: string;
  available: boolean;
};

export interface IPackage {
  name: string;
  services: TPackageService[];
  price: number;
  expire_after_hours: number;
  available_from: Date;
  available_until: Date;
}
