#pragma once

#include <stdint.h>
#include <stddef.h>

/*  ----- TYPE DEFINITION FOR BlsVerifyPayload ----- */

struct __attribute__((packed)) BlsVerifyPayload {
    uint8_t pubkey[96];
    uint8_t signature[96];
    uint16_t msg_len;
    uint8_t message[] /* FAM size: msg_len */;
};
typedef struct BlsVerifyPayload BlsVerifyPayload_t;

/*  ----- TYPE DEFINITION FOR EventPayload ----- */

struct __attribute__((packed)) EventPayload {
    uint8_t event_type;
    uint16_t data_len;
    uint8_t data[] /* FAM size: data_len */;
};
typedef struct EventPayload EventPayload_t;

/*  ----- TYPE DEFINITION FOR Instruction ----- */

struct __attribute__((packed)) Instruction {
    uint8_t tag;
    uint16_t data_len;
    uint8_t data[] /* FAM size: data_len */;
};
typedef struct Instruction Instruction_t;

/*  ----- TYPE DEFINITION FOR KvGetPayload ----- */

struct __attribute__((packed)) KvGetPayload {
    uint8_t key_len;
    uint8_t key[] /* FAM size: key_len */;
};
typedef struct KvGetPayload KvGetPayload_t;

/*  ----- TYPE DEFINITION FOR KvSetPayload ----- */

struct __attribute__((packed)) KvSetPayload {
    uint8_t key_len;
    uint8_t key[] /* FAM size: key_len */;
    /// uint16_t val_len;
    /// uint8_t val[] /* FAM size: val_len */;
};
typedef struct KvSetPayload KvSetPayload_t;

/*  ----- TYPE DEFINITION FOR MerklePayload ----- */

struct __attribute__((packed)) MerklePayload {
    uint16_t chunk_size;
    uint16_t data_len;
    uint8_t data[] /* FAM size: data_len */;
};
typedef struct MerklePayload MerklePayload_t;

/*  ----- TYPE DEFINITION FOR PsiError ----- */

struct __attribute__((packed)) PsiError {
    uint8_t tag;
    uint8_t body[]; /* enum body inline (access via getters) */
};
typedef struct PsiError PsiError_t;

/*  ----- TYPE DEFINITION FOR PsiState ----- */

struct __attribute__((packed)) PsiState {
    uint64_t magic;
    uint64_t counter;
    uint16_t kv_count;
    uint16_t data_offset;
};
typedef struct PsiState PsiState_t;

/*  ----- TYPE DEFINITION FOR ReadDataPayload ----- */

struct __attribute__((packed)) ReadDataPayload {
    uint16_t offset;
    uint16_t length;
};
typedef struct ReadDataPayload ReadDataPayload_t;

/*  ----- TYPE DEFINITION FOR TransferPayload ----- */

struct __attribute__((packed)) TransferPayload {
    uint64_t amount;
};
typedef struct TransferPayload TransferPayload_t;

/*  ----- TYPE DEFINITION FOR VersionInfo ----- */

struct __attribute__((packed)) VersionInfo {
    uint8_t major;
    uint8_t minor;
    uint8_t patch;
};
typedef struct VersionInfo VersionInfo_t;


/*  ----- FORWARD DECLARATIONS FOR BlsVerifyPayload ----- */

BlsVerifyPayload_t const * BlsVerifyPayload_from_slice( uint8_t const * data, uint64_t data_len );
BlsVerifyPayload_t * BlsVerifyPayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int BlsVerifyPayload_new( uint8_t * buffer, uint64_t buffer_size, uint16_t msg_len, uint64_t * out_size );
uint64_t BlsVerifyPayload_footprint( int64_t msg_len );
uint64_t BlsVerifyPayload_footprint_ir( uint64_t message_msg_len );
int BlsVerifyPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t message_msg_len );
int BlsVerifyPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint16_t BlsVerifyPayload_get_msg_len( BlsVerifyPayload_t const * self );


uint64_t BlsVerifyPayload_get_pubkey_length( BlsVerifyPayload_t const * self );
uint8_t BlsVerifyPayload_get_pubkey_at( BlsVerifyPayload_t const * self, uint64_t index );
void BlsVerifyPayload_set_pubkey_at( BlsVerifyPayload_t * self, uint64_t index, uint8_t value );
uint64_t BlsVerifyPayload_get_signature_length( BlsVerifyPayload_t const * self );
uint8_t BlsVerifyPayload_get_signature_at( BlsVerifyPayload_t const * self, uint64_t index );
void BlsVerifyPayload_set_signature_at( BlsVerifyPayload_t * self, uint64_t index, uint8_t value );



/*  ----- FORWARD DECLARATIONS FOR EventPayload ----- */

EventPayload_t const * EventPayload_from_slice( uint8_t const * data, uint64_t data_len );
EventPayload_t * EventPayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int EventPayload_new( uint8_t * buffer, uint64_t buffer_size, uint16_t data_len, uint64_t * out_size );
uint64_t EventPayload_footprint( int64_t data_len );
uint64_t EventPayload_footprint_ir( uint64_t data_data_len );
int EventPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t data_data_len );
int EventPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint8_t EventPayload_get_event_type( EventPayload_t const * self );
uint16_t EventPayload_get_data_len( EventPayload_t const * self );

void EventPayload_set_event_type( EventPayload_t * self, uint8_t value );




/*  ----- FORWARD DECLARATIONS FOR Instruction ----- */

Instruction_t const * Instruction_from_slice( uint8_t const * data, uint64_t data_len );
Instruction_t * Instruction_from_slice_mut( uint8_t * data, uint64_t data_len );
int Instruction_new( uint8_t * buffer, uint64_t buffer_size, uint16_t data_len, uint64_t * out_size );
uint64_t Instruction_footprint( int64_t data_len );
uint64_t Instruction_footprint_ir( uint64_t data_data_len );
int Instruction_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t data_data_len );
int Instruction_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint8_t Instruction_get_tag( Instruction_t const * self );
uint16_t Instruction_get_data_len( Instruction_t const * self );

void Instruction_set_tag( Instruction_t * self, uint8_t value );




/*  ----- FORWARD DECLARATIONS FOR KvGetPayload ----- */

KvGetPayload_t const * KvGetPayload_from_slice( uint8_t const * data, uint64_t data_len );
KvGetPayload_t * KvGetPayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int KvGetPayload_new( uint8_t * buffer, uint64_t buffer_size, uint8_t key_len, uint64_t * out_size );
uint64_t KvGetPayload_footprint( int64_t key_len );
uint64_t KvGetPayload_footprint_ir( uint64_t key_key_len );
int KvGetPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t key_key_len );
int KvGetPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint8_t KvGetPayload_get_key_len( KvGetPayload_t const * self );





/*  ----- FORWARD DECLARATIONS FOR KvSetPayload ----- */

KvSetPayload_t const * KvSetPayload_from_slice( uint8_t const * data, uint64_t data_len );
KvSetPayload_t * KvSetPayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int KvSetPayload_new( uint8_t * buffer, uint64_t buffer_size, uint8_t key_len, uint16_t val_len, uint64_t * out_size );
uint64_t KvSetPayload_footprint( int64_t key_len, int64_t val_len );
uint64_t KvSetPayload_footprint_ir( uint64_t key_key_len, uint64_t val_val_len );
int KvSetPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t key_key_len, uint64_t val_val_len );
int KvSetPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint8_t KvSetPayload_get_key_len( KvSetPayload_t const * self );
uint16_t KvSetPayload_get_val_len( KvSetPayload_t const * self );





/*  ----- FORWARD DECLARATIONS FOR MerklePayload ----- */

MerklePayload_t const * MerklePayload_from_slice( uint8_t const * data, uint64_t data_len );
MerklePayload_t * MerklePayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int MerklePayload_new( uint8_t * buffer, uint64_t buffer_size, uint16_t data_len, uint64_t * out_size );
uint64_t MerklePayload_footprint( int64_t data_len );
uint64_t MerklePayload_footprint_ir( uint64_t data_data_len );
int MerklePayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed, uint64_t data_data_len );
int MerklePayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint16_t MerklePayload_get_chunk_size( MerklePayload_t const * self );
uint16_t MerklePayload_get_data_len( MerklePayload_t const * self );

void MerklePayload_set_chunk_size( MerklePayload_t * self, uint16_t value );




/*  ----- FORWARD DECLARATIONS FOR PsiError ----- */

uint64_t PsiError_footprint( void );
uint64_t PsiError_size( PsiError_t const * self );

/*  ----- FORWARD DECLARATIONS FOR PsiState ----- */

PsiState_t const * PsiState_from_slice( uint8_t const * data, uint64_t data_len );
PsiState_t * PsiState_from_slice_mut( uint8_t * data, uint64_t data_len );
int PsiState_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size );
uint64_t PsiState_footprint( void );
uint64_t PsiState_footprint_ir( void );
int PsiState_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed );
int PsiState_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint64_t PsiState_get_magic( PsiState_t const * self );
uint64_t PsiState_get_counter( PsiState_t const * self );
uint16_t PsiState_get_kv_count( PsiState_t const * self );
uint16_t PsiState_get_data_offset( PsiState_t const * self );

void PsiState_set_magic( PsiState_t * self, uint64_t value );
void PsiState_set_counter( PsiState_t * self, uint64_t value );
void PsiState_set_kv_count( PsiState_t * self, uint16_t value );
void PsiState_set_data_offset( PsiState_t * self, uint16_t value );




/*  ----- FORWARD DECLARATIONS FOR ReadDataPayload ----- */

ReadDataPayload_t const * ReadDataPayload_from_slice( uint8_t const * data, uint64_t data_len );
ReadDataPayload_t * ReadDataPayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int ReadDataPayload_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size );
uint64_t ReadDataPayload_footprint( void );
uint64_t ReadDataPayload_footprint_ir( void );
int ReadDataPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed );
int ReadDataPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint16_t ReadDataPayload_get_offset( ReadDataPayload_t const * self );
uint16_t ReadDataPayload_get_length( ReadDataPayload_t const * self );

void ReadDataPayload_set_offset( ReadDataPayload_t * self, uint16_t value );
void ReadDataPayload_set_length( ReadDataPayload_t * self, uint16_t value );




/*  ----- FORWARD DECLARATIONS FOR TransferPayload ----- */

TransferPayload_t const * TransferPayload_from_slice( uint8_t const * data, uint64_t data_len );
TransferPayload_t * TransferPayload_from_slice_mut( uint8_t * data, uint64_t data_len );
int TransferPayload_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size );
uint64_t TransferPayload_footprint( void );
uint64_t TransferPayload_footprint_ir( void );
int TransferPayload_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed );
int TransferPayload_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint64_t TransferPayload_get_amount( TransferPayload_t const * self );

void TransferPayload_set_amount( TransferPayload_t * self, uint64_t value );




/*  ----- FORWARD DECLARATIONS FOR VersionInfo ----- */

VersionInfo_t const * VersionInfo_from_slice( uint8_t const * data, uint64_t data_len );
VersionInfo_t * VersionInfo_from_slice_mut( uint8_t * data, uint64_t data_len );
int VersionInfo_new( uint8_t * buffer, uint64_t buffer_size, uint64_t * out_size );
uint64_t VersionInfo_footprint( void );
uint64_t VersionInfo_footprint_ir( void );
int VersionInfo_validate_ir( uint64_t buf_sz, uint64_t * out_bytes_consumed );
int VersionInfo_validate( uint8_t const * data, uint64_t data_len, uint64_t * out_size );
uint8_t VersionInfo_get_major( VersionInfo_t const * self );
uint8_t VersionInfo_get_minor( VersionInfo_t const * self );
uint8_t VersionInfo_get_patch( VersionInfo_t const * self );

void VersionInfo_set_major( VersionInfo_t * self, uint8_t value );
void VersionInfo_set_minor( VersionInfo_t * self, uint8_t value );
void VersionInfo_set_patch( VersionInfo_t * self, uint8_t value );



