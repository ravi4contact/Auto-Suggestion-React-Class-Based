// basic.autosuggest.js
import React, { Fragment } from 'react';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import './autosuggest.css'; 
import Search from "./images/search.png";
import Clear from "./images/clear.png";
import { people } from "./db/data";
import { getUsers, debouncedSearchAPI,throttledSearchAPI } from "./apis/user";



class FocusAutoSuggest extends React.Component {
    constructor() {
        super();

        //Define state for value and suggestion collection
        this.state = {
            value: '',
            suggestions: []
        };
    }
    escapeRegexCharacters = (str)  => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }   


    getSuggestions = async (value)  =>{  
        /*const inputLength = value.length;
        if(inputLength<3){
            return ['Type minimum 3 letter'];
        }*/
        const escapedValue = this.escapeRegexCharacters(value.trim().toLowerCase());
        if (escapedValue === '') {
          return [];
        }
        let response = await throttledSearchAPI()
                            .then(data => data.json())
                            .catch((error) => {
                                console.error('Error:', error);
                            });

                            
                            
        response = (response) ? response: people;
        let suggestionFilter = await response.filter(obj => Object.values(obj).some(val => (String(val).toLowerCase()).includes(escapedValue)))
       
        if(!suggestionFilter.length){
            suggestionFilter.push('No user found')
        }
        return suggestionFilter;
    }

    // Trigger suggestions
    getSuggestionValue = suggestion => suggestion.name;

    // Render Each Option

     renderSuggestion =  (suggestion, { query }) => {
        if(suggestion === "No user found" || suggestion === "Type minimum 3 letter"){
            return (
                <div className ={'errorMsg'}>{suggestion}</div>
            )
        }
        let idText = this.renderSuggestionSplit(suggestion.id, { query })
        let nameText = this.renderSuggestionSplit(suggestion.name, { query })
        let addressText = this.renderSuggestionSplit(suggestion.address, { query })
        let pinCodeText = this.renderSuggestionSplit(suggestion.pincode, { query })
       
        return (
               <div className={'suggestion-content-parent'}>
                  <div><b>{idText}</b></div>
                  <div><i>{nameText}</i></div>
                  <div>{addressText}</div>
                  <div>{pinCodeText}</div>
               </div>)
      }

      renderSuggestionSplit =  (val, { query }) => {
        const suggestionText = `${val}`;
        const matches = AutosuggestHighlightMatch(suggestionText, query);
        const parts = AutosuggestHighlightParse(suggestionText, matches);
      
        return (
                <span className={'suggestion-content '}>
                    <span className="name">
                    {
                        parts.map((part, index) => {
                        const className = part.highlight ? 'highlight' : null;
            
                        return (
                            <span className={className} key={index}>{part.text}</span>
                        );
                        })
                    }
                    </span>
                </span>
        );
      }


    // OnChange event handler
    onChange = (event, { newValue }) => {
        
        this.setState({
            suggestions: [],
            value: newValue
        });
    };

    // Suggestion rerender when user types
    onSuggestionsFetchRequested = ({ value }) => {
        this.getSuggestions(value)
            .then(data => {
                if (data.Error) {
                    this.setState({
                        suggestions: []
                    });
                } else {
                    this.setState({
                        suggestions: data
                    });
                }
            })
    };

    // Triggered on clear
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    onClear = () => {
        
        this.setState({
            suggestions: [],
            value: ''
        });
    };
    render() {
        const { value, suggestions } = this.state;

        // Option props
        const inputProps = {
            placeholder: 'Search users by ID, address and name',
            value,
            onChange: this.onChange,
            onkeydown: this.onChange
        };

        // Adding AutoSuggest component
        return (
            <Fragment>
                <div className = {"searchLogoContainer"}>
                    <img  alt="Search" className = {"searchLogo"}src={Search}></img>
                </div>
                <Autosuggest
                    className = {"searchInputBox"} 
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
                <div className = {"clearLogoContainer"}>
                    <img  alt="Clear" onClick ={this.onClear} className = {"clearLogo"}src={Clear}></img>
                </div>
            </Fragment>
        );
    }
}

export default FocusAutoSuggest;