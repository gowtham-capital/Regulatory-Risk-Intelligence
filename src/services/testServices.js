import { fetchCongressBills }   from './congressGov.js'
import { fetchFederalRegister } from './federalRegister.js'
import { fetchFCCProceedings }  from './fcc.js'
import { fetchLobbying }        from './senateLDA.js'
import { fetchFTCActions }      from './ftcFeed.js'
import { fetchNews }            from './newsService.js'

export async function runAllServiceTests(companyName = 'Netflix') {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`TESTING ALL 6 SERVICES — Company: ${companyName}`)
  console.log('='.repeat(50))

  const services = [
    { name: 'Congress.gov',      fn: fetchCongressBills   },
    { name: 'Federal Register',  fn: fetchFederalRegister },
    { name: 'FCC ECFS',          fn: fetchFCCProceedings  },
    { name: 'Senate LDA',        fn: fetchLobbying        },
    { name: 'FTC Feed',          fn: fetchFTCActions      },
    { name: 'NewsAPI',           fn: fetchNews            },
  ]

  const results = {}

  for (const svc of services) {
    const result = await svc.fn(companyName)
    results[svc.name] = result
    const status = result.error ? '❌ ERROR' : '✅ OK'
    console.log(`${status}  ${svc.name}: ${result.count} items`)
    if (result.error) console.error(`       Error: ${result.error}`)
    if (result.items?.[0]) console.log(`       Sample: ${JSON.stringify(result.items[0]).slice(0, 120)}...`)
  }

  console.log('\n' + '='.repeat(50))
  console.log('TEST COMPLETE — store in window.__testResults to inspect')
  console.log('='.repeat(50) + '\n')

  window.__testResults = results
  return results
}
