-- This migration must be deployed only after existing duplicate active permits
-- have been cleaned up. It enforces RCD's rule that each permit holder can
-- have at most one active permit at a time.
CREATE UNIQUE INDEX "permits_one_active_per_applicant"
ON "permits"("applicant_id")
WHERE "active" = true;
