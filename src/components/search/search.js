import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from '../../api';

const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null);

    const loadOptions = (inputValue) => { // fetch GeoDB API in here to search for the cities
        return fetch(
          `${GEO_API_URL}/cities?minPopulation= &namePrefix=${inputValue}`, 
          geoApiOptions
        )
// requires an array of objects with value and label properties
        .then(response => response.json())
        .then((response) => {
            return{
                options: response.data.map((city) => {
                    return {
                        value: `${city.latitude} ${city.longitude}` ,
                        label:  `${city.name}, ${city.countryCode}` ,
                    };
                }), 
            };
            
        })
        .catch((err) => console.error(err));
        
    };

    const handleOnChange= (searchData) => {
        setSearch(searchData); // setSearch will update the search data
        onSearchChange(searchData);
    }

    return(
        <AsyncPaginate 
            placeholder= "Search for city" // search for city to display the weather for that city
            debounceTimeout={600} //600 miliseconds
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    )
}

export default Search;