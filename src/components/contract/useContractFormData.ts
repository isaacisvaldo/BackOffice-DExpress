import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchCompanyClients, type ClientCompanyProfile } from "@/services/client/company/client-company-profile.service";
import { fetchIndividualClients, type ClientProfile } from "@/services/client/client.service";
import { getAllPackages, type Package } from "@/services";
import { dropdownProfessionals, type Professional } from "@/services/profissional/profissional.service";
import { getDesiredPositionsList, type DesiredPosition } from "@/services/desired-positions/desired-positions.service";
import { getCitiesList } from "@/services/location/cities.service";
import { getDistrictsByCityId } from "@/services/location/districts.service";
import type { City } from "@/components/location/citiesColunn";
import type { District } from "@/types/types";


export function useContractFormData(cityId?: string) {
  const [companyClients, setCompanyClients] = useState<ClientCompanyProfile[]>([]);
  const [individualClients, setIndividualClients] = useState<ClientProfile[]>([]);
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
          companyClientsData,
          individualClientsData,
          packagesData,
          professionalsData,
          desiredPositionsData,
          citiesData,
        ] = await Promise.all([
          fetchCompanyClients(),
          fetchIndividualClients(),
          getAllPackages(),
          dropdownProfessionals(),
          getDesiredPositionsList(),
          getCitiesList(),
        ]);

        setCompanyClients(companyClientsData);
        setIndividualClients(individualClientsData);
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
    companyClients,
    individualClients,
    packages,
    professionals,
    desiredPositions,
    cities,
    districts,
  };
}
