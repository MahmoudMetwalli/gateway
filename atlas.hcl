// atlas.hcl

data "external_schema" "prisma" {
    program = [ 
      "npx",
      "prisma",
      "migrate",
      "diff",
      "--from-empty",
      "--to-schema-datamodel",
      "prisma/schema",
      "--script"
    ]
}

env "local" {
  url = "postgres://it_admin:system_admin567@localhost:5432/gateway_db?sslmode=disable"
  dev = "docker://postgres/17/dev?search_path=public"
  schema {
    src = data.external_schema.prisma.url
  }
  migration {
    dir = "file://atlas/migrations"
    exclude = ["_prisma_migrations"]
  }
}
