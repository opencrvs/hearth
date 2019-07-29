import http from 'k6/http'
import {check, sleep} from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3447'

// PATH - the path to the resource. Default is path to the patient resource
const RESOURCE_PATH = __ENV.RESOURCE_PATH || '/fhir/patient'

export const options = {
	stages: [
		{duration: '30s', target: 100},
		{duration: '1m'},
		{duration: '30s', target: 0}   
	],
	thresholds: {
    http_req_duration: ['p(95)<600']
  },
  noVUConnectionReuse: true,
  discardResponseBodies: true
}

const makeGetRequest = () => {
	const response = http.get(
		`${BASE_URL}${RESOURCE_PATH}`,
		{
			headers: {
				Accept: 'application/json'
			},
			tags: {
				name: 'Get request'
			}
		}
	)
	check(response, {
		'status code is 200': r => r.status === 200
	})
}

export default function() {
	makeGetRequest()
}