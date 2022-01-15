# Script for resetting Heroku Postgres DB. Steps:
# 1. Clear data and tables of DB
# 2. Configure DB with enums and tables defined in `prisma/schema.sql`
# 3. Introspect DB to generate `prisma/schema.prisma` and generate Prisma client
# 4. Seed DB
#
# Usage: Ensure that user is logged into Heroku and run `sh reset-db.sh <Heroku db name>`
#

echo "Seeding DB $1. Ensure that you are logged into Heroku"

heroku pg:reset -a $1 --confirm $1 && heroku pg:psql -a $1 -f prisma/schema.sql && npx prisma db pull && npx prisma format && npx prisma generate && npx prisma db seed --preview-feature