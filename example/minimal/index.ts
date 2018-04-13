import { GitHub } from '..'

const binding = new GitHub(process.env.GH_AUTH_TOKEN!)

async function run() {
  const licenses = await binding.query.licenses({}, '{name}')

  console.log({ licenses })
}

run()
