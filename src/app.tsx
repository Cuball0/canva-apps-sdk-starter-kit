import {
  Button, CheckboxGroup,
  FormField,
  MultilineInput,
  Rows,
  Text, TextInput,
  Title,
} from "@canva/app-ui-kit";
import React, { useState } from "react";
import styles from "styles/components.css";
import {addNativeElement} from "@canva/design";
import { getDefaultPageDimensions } from "@canva/design";

//action=teams&context=BVBL1432

const TEAMS_BACKEND_URL = `${BACKEND_HOST}&action=teams`;
const GAMES_BACKEND_URL = `${BACKEND_HOST}&action=games`;

type State = "idle" | "loading" | "success" | "error";

export const App = () => {
  const [state, setState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined
  );

  const [gamesBody, setGamesBody] = useState<unknown | undefined>(
      undefined
  );

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>();
  const getTeamsRequest = async () => {
    try {
      setState("loading");
    
      const res = await fetch(TEAMS_BACKEND_URL +'&context=BVBL1432', {
       
      });


      const body = await res.json();


      setResponseBody(body);
      setState("success");
    } catch (error) {
      setState("error");
      console.error(error);
    }
  };

  const handleCheckboxChange = (newSelectedValues: string[]) => {
    setSelectedValues(newSelectedValues);
  };

  const getGamesRequest = async () => {
    try {
      setState("loading");
      console.error(selectedValues);

      const res = await fetch(GAMES_BACKEND_URL + "&context=" + selectedValues + "&date=" + selectedDate, {

      });

      const body = await res.json();

      console.error(body);


      const defaultPageDimensions = await getDefaultPageDimensions();

      let blocksizePixels = defaultPageDimensions?.width / 21;

          for (let i = 0; i < body.results.games.length; i++) {

            await addNativeElement({
              type: "TEXT",
              children: [body.results.games[i].tTNaam],
              fontSize: 25,
              color: "#ffffff",
              top: 100 * (i+1),
              left: blocksizePixels,
              width: blocksizePixels*8
            });

            await addNativeElement({
              type: "TEXT",
              children: [body.results.games[i].beginTijd + "\n-VS-"],
              fontSize: 25,
              color: "#ffffff",
              top: 100 * (i+1),
              left: blocksizePixels*9,
              width: blocksizePixels*3
            });
            await addNativeElement({
              type: "TEXT",
              children: [body.results.games[i].tUNaam],
              fontSize: 25,
              color: "#ffffff",
              top: 100 * (i+1),
              left: blocksizePixels*12,
              width: blocksizePixels*8
            });
          }



    //  setGamesBody(body);
      setState("success");
    } catch (error) {
      setState("error");
      console.error(error);
    }
  };

  function handleDateChange(newSelectedText: string) {
    setSelectedDate(newSelectedText);
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
         Ophalen van teams en matches van basket Blankenberge
        </Text>

        <TextInput
            onBlur={function noRefCheck(){}}
            onChange={handleDateChange}
            onFocus={function noRefCheck(){}}
            onKeyDown={function noRefCheck(){}}
            placeholder="Formaat: 17-08-2024"
        />
        {/* Idle and loading state */}
        {state !== "error" && (
          <>
            <Button
              variant="primary"
              onClick={getTeamsRequest}
              loading={state === "loading"}
              stretch
            >
              Get Teams
            </Button>
            {state === "success" && responseBody && (

              <CheckboxGroup
              onBlur={function noRefCheck(){}}
            onChange={handleCheckboxChange}
            onFocus={function noRefCheck(){}}
            options={responseBody["results"].teams}
          />


            )}

            {state === "success" && responseBody && (
                <Button
                      variant="primary"
                      onClick={getGamesRequest}
                      loading={state === "loading"}
                      stretch

                >
                  Get Games for selected teams
                </Button>



            )}
          </>
        )}

        {/* Error state */}
        {state === "error" && (
          <Rows spacing="3u">
            <Rows spacing="1u">
              <Title size="small">Something went wrong</Title>
              <Text>To see the error, check the JavaScript Console.</Text>
            </Rows>
            <Button
              variant="secondary"
              onClick={() => {
                setState("idle");
              }}
              stretch
            >
              Reset
            </Button>
          </Rows>
        )}
      </Rows>
    </div>
  );
};
