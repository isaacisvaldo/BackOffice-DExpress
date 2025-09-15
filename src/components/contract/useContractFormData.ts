import { useEffect, useState } from "react";
import { toast } from "sonner";


import { getAllPackages, type Package } from "@/services";
import { dropdownProfessionals, type Professional } from "@/services/profissional/profissional.service";
import { getDesiredPositionsList, type DesiredPosition } from "@/services/desired-positions/desired-positions.service";
import { getCitiesList } from "@/services/location/cities.service";
import { getDistrictsByCityId } from "@/services/location/districts.service";
import type { City } from "@/components/location/citiesColunn";
import type { District } from "@/types/types";
import { getSectorsList } from "@/services/shared/sector/sector.service";
import type { Sector } from "@/services/sector/sector.service";


export function useContractFormData(cityId?: string) {

  const [sectors, setSectores] = useState<Sector[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [desiredPositions, setDesiredPositions] = useState<DesiredPosition[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch inicial
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          sectors,
          packagesData,
          professionalsData,
          desiredPositionsData,
          citiesData,
        ] = await Promise.all([
          getSectorsList(),
          getAllPackages(),
          dropdownProfessionals(),
          getDesiredPositionsList(),
          getCitiesList(),
        ]);


       setSectores(sectors);
        setPackages(packagesData);
        setProfessionals(professionalsData);
        setDesiredPositions(desiredPositionsData);
        setCities(citiesData);
      } catch (error: any) {
        console.error("Erro ao carregar dados do contrato:", error);
        toast.error(error.message || "Erro ao carregar dados do contrato.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch distritos quando cityId mudar
  useEffect(() => {
    if (!cityId) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const districtsData = await getDistrictsByCityId(cityId);
        setDistricts(districtsData);
      } catch (error) {
        console.error("Erro ao carregar distritos:", error);
        toast.error("Erro ao carregar distritos.");
      }
    };

    fetchDistricts();
  }, [cityId]);

  return {
    loading,
   sectors,
    packages,
    professionals,
    desiredPositions,
    cities,
    districts,
  };
}
