from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b4c5d6e7f8a9"
down_revision: Union[str, None] = "d22819b0aa66"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "endpoint",
        sa.Column(
            "request_mapping_type",
            sa.String(),
            nullable=True,
            server_default="json",
        ),
    )
    # Set existing rows to 'json' (they are all JSON mappings)
    op.execute(
        "UPDATE endpoint SET request_mapping_type = 'json' WHERE request_mapping_type IS NULL"
    )


def downgrade() -> None:
    op.drop_column("endpoint", "request_mapping_type")
