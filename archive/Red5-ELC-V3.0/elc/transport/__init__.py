"""L1 — Transport layer (ScuLink + supervisor).

Public surface kept minimal so drivers depend on the *contract*, not
the asyncio internals.
"""

from elc.transport.tcp_scu import LinkState, ScuLink

__all__ = ["LinkState", "ScuLink"]
