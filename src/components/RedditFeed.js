import React, { useState } from 'react'
import styled from 'styled-components'
export default function RedditFeed() {
  const [feed, setFeed] = useState([])
  const fetchData = async (query = `javascript`) => {
    const response = await fetch(`https://www.reddit.com/r/${query}/.json`)
    const json = await response.json()
    const data = await json.data
    setFeed(data.children.slice(0, 10))
  }
  if (!feed.length) {
    fetchData()
  }

  const fetchAutoComplete = async query => {
    const response = await fetch(
      `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${query}&include_over_18=false&include_categories=false&include_profiles=false&limit=10`
    )
    const json = await response.json()
    const data = await json.data.children.map(({ data }) => data)
    return data
  }
  const [suggestions, setSuggestions] = useState([])
  const [subredditAutocompleteQuery, setSubredditAutocompleteQuery] = useState(
    ``
  )
  const updateAutoComplete = async ({ target: { value } }) => {
    setSubredditAutocompleteQuery(value)
    if (subredditAutocompleteQuery.length > 0) {
      const suggestions = await fetchAutoComplete(value)
      console.log(suggestions)

      const returnedSuggestions = suggestions
        .filter(({ subreddit_type }) => subreddit_type !== `private`)
        .map(({ display_name }) => display_name)
      setSuggestions(returnedSuggestions)
    } else {
      setSuggestions([])
    }
  }
  return (
    <Postwrap>
      <OptionSelector>
        <SearchBox
          placeholder={`Select subreddit`}
          onChange={updateAutoComplete}
          value={subredditAutocompleteQuery}
        />
        <SuggestionDropdown>
          {suggestions.map(suggestion => (
            <li
              onClick={() => {
                fetchData(suggestion)
                setSuggestions([])
                setSubredditAutocompleteQuery(``)
              }}
            >
              {suggestion}
            </li>
          ))}
        </SuggestionDropdown>
      </OptionSelector>
      <PostList>{feed.map(PostTile)}</PostList>
    </Postwrap>
  )
}
const SuggestionDropdown = styled.ul`
  z-index: 100;
  background: white;
  width: 100%;
  position: absolute;
  & li {
    cursor: pointer;
    &:hover {
      background: #aaa;
    }
  }
`

const SearchBox = styled.input``

const OptionSelector = styled.div`
  display: inline-block;
  position: relative;
`
const Postwrap = styled.div`
  grid-column: span 4;
  grid-row: span 2;
  overflow-y: scroll;
`
const PostList = styled.ul``

const PostTile = ({
  data: { author, id, score, selftext, subreddit, title, url },
}) => (
  <PostWrap key={id}>
    <div>r/{subreddit}</div>
    <h5>{title}</h5>
    <div>{author}</div>
    <div>
      {score === 0 ? '' : score > 0 ? '+' : '-'}
      {score}
    </div>
    {/* <div>{selftext}</div> */}
    <a href={url} target='__newtab'>
      Read
    </a>
  </PostWrap>
)

const PostWrap = styled.li`
   padding: 10px 20px;
    position: relative;
    overflow-wrap: break-word;
    box-shadow: 0 0 35px rgba(50, 50, 50, 0.4), 0 0 10px rgba(20, 20, 20, 0.4);
    border-radius: 5px;
    background-color: rgba(var(--rgb-main-light), 0.5);
    margin: 0 0 1vw 0;

    & h5 {
      font-size: 19px;
      margin-bottom: 10px;
    }

    & a, a:visited {
      color: var(--brand-color);
    }
  }

  & li:hover {
    transform: translateY(-10px);
  }
`