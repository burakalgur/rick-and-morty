import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Checkbox } from '@mui/material';
import axios from 'axios';
import { Character } from './types';

const MultiSelectAutocomplete: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);

    const fetchCharacters = async (input: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://rickandmortyapi.com/api/character/?name=${input}`);
            setCharacters(response.data.results);
        } catch (error) {
            console.error('API error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setQuery(input);
        fetchCharacters(input);
    };

    const handleAutocompleteChange = (event: React.ChangeEvent<{}>, newValue: Character[]) => {
        setSelectedCharacters(newValue);
        if (newValue.length === 0) {
            setQuery('');
        }
    };

    const highlightQuery = (text: string, query: string): React.ReactNode => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => (
            regex.test(part) ? <strong key={index}>{part}</strong> : part
        ));
    };

    const handleOpen = () => {
        fetchCharacters(query);
    };

    const isOptionSelected = (option: Character) => {
        return selectedCharacters.some((character) => character.id === option.id);
    };

    return (
        <Autocomplete
            multiple
            options={characters}
            loading={loading}
            getOptionLabel={(option) => option.name}
            value={selectedCharacters}
            onChange={handleAutocompleteChange}
            inputValue={query}
            onInputChange={(event, newInputValue) => setQuery(newInputValue)}
            onOpen={handleOpen}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Search Characters"
                    onChange={handleInputChange}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={isOptionSelected(option)} 
                        onChange={(event) => {
                            const isChecked = event.target.checked;
                            const newValue = isChecked
                                ? [...selectedCharacters, option]
                                : selectedCharacters.filter((character) => character.id !== option.id);

                            setSelectedCharacters(newValue);
                        }}
                    />
                    <img src={option.image} alt={option.name} style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                    <div style={{ marginLeft: '10px' }}>
                        <div>{highlightQuery(option.name, query)}</div>
                        <div>{`${option.episode.length} Episodes`}</div>
                    </div>
                </li>
            )}
        />
    );
};

export default MultiSelectAutocomplete;
