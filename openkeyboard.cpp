#include "steam/steam_api.h"

#define V_ARRAYSIZE(a) sizeof(a)/sizeof(a[0]) 

static int RealMain( const char *pchCmdLine )
{
	if ( SteamAPI_RestartAppIfNecessary( k_uAppIdInvalid ) )
	{
		return 1;
	}

	if ( !SteamAPI_Init() )
	{
		return 1;
	}
	
	SteamUtils()->ShowFloatingGamepadTextInput(EFloatingGamepadTextInputMode::k_EFloatingGamepadTextInputModeModeSingleLine, 0, 0, 300, 40);

	SteamAPI_Shutdown();

	return 0;	
}

int main(int argc, const char **argv)
{
    char szCmdLine[1024];
    char *pszStart = szCmdLine;
    char * const pszEnd = szCmdLine + V_ARRAYSIZE(szCmdLine);
    *szCmdLine = '\0';
    for ( int i = 1; i < argc; i++ )
    {
        const char *parm = argv[i];
        while ( *parm && (pszStart < pszEnd) )
        {
            *pszStart++ = *parm++;
        }
        if ( pszStart >= pszEnd )
            break;
        if ( i < argc-1 )
            *pszStart++ = ' ';
    }
    szCmdLine[V_ARRAYSIZE(szCmdLine) - 1] = '\0';
    return RealMain( szCmdLine );
}

