/**
 * lambda file
 */
import serverlessHTTP from 'serverless-http'
import app1 from './app'

export const app = serverlessHTTP(app1)
