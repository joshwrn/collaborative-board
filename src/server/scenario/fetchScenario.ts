import { fetchFromApi } from '../response'

export type ScenarioResponse = {
  scenario: string
}

export type ScenarioRequest = {
  scenario: string
}

export const fetchScenario = fetchFromApi<ScenarioRequest, ScenarioResponse>(
  `scenario`,
  `GET`,
)
