from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b1c2d3e4f5a6"
down_revision: Union[str, None] = "533ebb47f308"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "endpoint",
        sa.Column("request_body_format", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("endpoint", "request_body_format")
