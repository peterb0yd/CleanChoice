# Deliverable 2 - Marketing channels not named

select
	c.id `ID`,
	c.full_name `Customer Name`,
	min(e.date_recorded) `Earliest Attempt Date`,
  max(e.date_recorded) `Latest Attempt Date`
from customer_accounts c
	join enrollment_attempts e
		on e.customer_id = c.id
	join marketing_channels m
		on m.id = e.marketing_channel_id
group by id;
